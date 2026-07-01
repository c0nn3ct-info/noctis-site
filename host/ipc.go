package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
)

const maxMessageSize = 1 << 20 // 1 MiB; matches Chrome's NM frame limit

func readFrame(r io.Reader) ([]byte, error) {
	var lenBuf [4]byte
	if _, err := io.ReadFull(r, lenBuf[:]); err != nil {
		return nil, err
	}
	length := binary.LittleEndian.Uint32(lenBuf[:])
	if length == 0 {
		return nil, fmt.Errorf("zero-length frame")
	}
	if length > maxMessageSize {
		return nil, fmt.Errorf("frame too large: %d bytes", length)
	}
	buf := make([]byte, length)
	if _, err := io.ReadFull(r, buf); err != nil {
		return nil, err
	}
	return buf, nil
}

func writeFrame(w io.Writer, payload any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	if len(body) > maxMessageSize {
		return fmt.Errorf("payload too large: %d bytes", len(body))
	}
	var lenBuf [4]byte
	binary.LittleEndian.PutUint32(lenBuf[:], uint32(len(body)))
	if _, err := w.Write(lenBuf[:]); err != nil {
		return err
	}
	if _, err := w.Write(body); err != nil {
		return err
	}
	return nil
}
