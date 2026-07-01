package main

import (
	"encoding/json"
	"errors"
	"fmt"
)

func init() { registerCore(xrayCore{}) }

// xrayCore drives XTLS/Xray-core. Config is JSON (camelCase, vnext/streamSettings);
// launched with `xray run -c <config.json>`; SOCKS port lives at inbounds[].port;
// outbounds bind to an interface via streamSettings.sockopt.interface.
type xrayCore struct{}

func (xrayCore) ID() string        { return "xray" }
func (xrayCore) ConfigExt() string { return "json" }

func (xrayCore) Locate() (string, error) {
	return locateBinary("XRAY_BIN", []string{"xray"})
}

func (xrayCore) RunArgs(cfgPath, _ string) []string {
	return []string{"run", "-c", cfgPath}
}

func (xrayCore) InjectPort(raw []byte, port int) ([]byte, error) {
	var doc map[string]any
	if err := json.Unmarshal(raw, &doc); err != nil {
		return nil, fmt.Errorf("config not json: %w", err)
	}
	inbounds, ok := doc["inbounds"].([]any)
	if !ok || len(inbounds) == 0 {
		return nil, errors.New("config missing inbounds")
	}
	patched := false
	for _, ib := range inbounds {
		m, ok := ib.(map[string]any)
		if !ok {
			continue
		}
		if p, _ := m["protocol"].(string); p == "socks" || p == "http" {
			m["port"] = port
			patched = true
		}
	}
	if !patched {
		return nil, errors.New("config has no socks inbound")
	}
	return json.MarshalIndent(doc, "", "  ")
}

// xray "outbound" protocols that carry real traffic (freedom/blackhole/dns are
// special and must not be bound to an interface).
var xrayProxyProtocols = map[string]bool{
	"vless": true, "vmess": true, "trojan": true, "shadowsocks": true,
	"socks": true, "http": true, "wireguard": true,
}

// SupportsClashAPI is false: xray-core has no Clash API. Stats degrade
// gracefully — the extension reads the all-false capabilities and shows the
// traffic view as unavailable for this core.
func (xrayCore) SupportsClashAPI() bool { return false }

// InjectClashAPI is a no-op for xray.
func (xrayCore) InjectClashAPI(raw []byte, _, _ string) ([]byte, error) { return raw, nil }

func (xrayCore) InjectBindInterface(raw []byte, iface string) ([]byte, error) {
	if iface == "" {
		return raw, nil
	}
	var doc map[string]any
	if err := json.Unmarshal(raw, &doc); err != nil {
		return nil, err
	}
	obs, ok := doc["outbounds"].([]any)
	if !ok {
		return raw, nil
	}
	for _, ob := range obs {
		m, ok := ob.(map[string]any)
		if !ok {
			continue
		}
		if p, _ := m["protocol"].(string); !xrayProxyProtocols[p] {
			continue
		}
		ss, ok := m["streamSettings"].(map[string]any)
		if !ok {
			ss = map[string]any{}
			m["streamSettings"] = ss
		}
		sock, ok := ss["sockopt"].(map[string]any)
		if !ok {
			sock = map[string]any{}
			ss["sockopt"] = sock
		}
		sock["interface"] = iface
	}
	return json.MarshalIndent(doc, "", "  ")
}
