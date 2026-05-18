package security

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"strings"

	"github.com/its-rory/translate/backend/internal/config"
)

const encryptedPrefix = "enc:v1:"

func EncryptSecret(plainText string) (string, error) {
	if plainText == "" {
		return "", nil
	}

	block, err := aes.NewCipher(deriveKey(config.GetConfig().EncryptionKey))
	if err != nil {
		return "", fmt.Errorf("failed to initialize cipher: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("failed to initialize GCM: %w", err)
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", fmt.Errorf("failed to generate nonce: %w", err)
	}

	cipherText := gcm.Seal(nil, nonce, []byte(plainText), nil)
	payload := append(nonce, cipherText...)
	return encryptedPrefix + base64.StdEncoding.EncodeToString(payload), nil
}

func DecryptSecret(cipherText string) (string, error) {
	if cipherText == "" {
		return "", nil
	}
	if !strings.HasPrefix(cipherText, encryptedPrefix) {
		return cipherText, nil
	}

	payload, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(cipherText, encryptedPrefix))
	if err != nil {
		return "", fmt.Errorf("failed to decode secret payload: %w", err)
	}

	block, err := aes.NewCipher(deriveKey(config.GetConfig().EncryptionKey))
	if err != nil {
		return "", fmt.Errorf("failed to initialize cipher: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("failed to initialize GCM: %w", err)
	}

	nonceSize := gcm.NonceSize()
	if len(payload) < nonceSize {
		return "", fmt.Errorf("secret payload too short")
	}

	nonce, encrypted := payload[:nonceSize], payload[nonceSize:]
	plainText, err := gcm.Open(nil, nonce, encrypted, nil)
	if err != nil {
		return "", fmt.Errorf("failed to decrypt secret: %w", err)
	}

	return string(plainText), nil
}

func MaskSecret(secret string) string {
	if secret == "" {
		return ""
	}
	if len(secret) <= 8 {
		return strings.Repeat("*", len(secret))
	}
	return secret[:4] + strings.Repeat("*", len(secret)-8) + secret[len(secret)-4:]
}

func deriveKey(raw string) []byte {
	sum := sha256.Sum256([]byte(raw))
	return sum[:]
}
