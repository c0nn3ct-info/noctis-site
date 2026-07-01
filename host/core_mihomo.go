package main

import (
	"errors"
	"fmt"

	"gopkg.in/yaml.v3"
)

func init() { registerCore(mihomoCore{}) }

// mihomoCore drives MetaCubeX/mihomo (Clash.Meta). Config is YAML; launched
// with `mihomo -d <dataDir> -f <config.yaml>`; the local SOCKS/mixed port lives
// on a `listeners:` entry; outbounds bind to an interface via top-level
// `interface-name`.
type mihomoCore struct{}

func (mihomoCore) ID() string        { return "mihomo" }
func (mihomoCore) ConfigExt() string { return "yaml" }

func (mihomoCore) Locate() (string, error) {
	return locateBinary("MIHOMO_BIN", []string{"mihomo", "clash-meta", "clash.meta"})
}

func (mihomoCore) RunArgs(cfgPath, dataDir string) []string {
	return []string{"-d", dataDir, "-f", cfgPath}
}

func (mihomoCore) InjectPort(raw []byte, port int) ([]byte, error) {
	var doc map[string]any
	if err := yaml.Unmarshal(raw, &doc); err != nil {
		return nil, fmt.Errorf("config not yaml: %w", err)
	}
	patched := false
	if listeners, ok := doc["listeners"].([]any); ok {
		for _, l := range listeners {
			if m, ok := l.(map[string]any); ok {
				m["port"] = port
				patched = true
			}
		}
	}
	// Also honor the shorthand inbound keys if present.
	for _, key := range []string{"mixed-port", "socks-port", "port"} {
		if _, ok := doc[key]; ok {
			doc[key] = port
			patched = true
		}
	}
	if !patched {
		return nil, errors.New("config has no listener to bind a port to")
	}
	return yaml.Marshal(doc)
}

// SupportsClashAPI is always true: mihomo's Clash API is built in.
func (mihomoCore) SupportsClashAPI() bool { return true }

// InjectClashAPI binds the built-in Clash API via the top-level
// external-controller + secret keys.
func (mihomoCore) InjectClashAPI(raw []byte, addr, secret string) ([]byte, error) {
	var doc map[string]any
	if err := yaml.Unmarshal(raw, &doc); err != nil {
		return nil, err
	}
	doc["external-controller"] = addr
	doc["secret"] = secret
	return yaml.Marshal(doc)
}

func (mihomoCore) InjectBindInterface(raw []byte, iface string) ([]byte, error) {
	if iface == "" {
		return raw, nil
	}
	var doc map[string]any
	if err := yaml.Unmarshal(raw, &doc); err != nil {
		return nil, err
	}
	doc["interface-name"] = iface
	return yaml.Marshal(doc)
}
