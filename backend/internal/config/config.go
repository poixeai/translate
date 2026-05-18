package config

import (
	"fmt"
	"os"
	"strings"
	"sync"
)

type Config struct {
	AdminUsername      string
	AdminPassword      string
	JWTSecret          string
	EncryptionKey      string
	DBPath             string
	Port               string
	AllowedCORSOrigins []string
}

var (
	cfg     *Config
	cfgOnce sync.Once
)

func GetConfig() *Config {
	cfgOnce.Do(func() {
		cfg = &Config{
			AdminUsername:      getEnv("ADMIN_USERNAME", "admin"),
			AdminPassword:      getEnv("ADMIN_PASSWORD", "admin"),
			JWTSecret:          getEnv("JWT_SECRET", "sk-jwt-8f7d9a2b3c4e5f6g7h8i9j0k1l2m3n4o"),
			EncryptionKey:      getEnv("ENCRYPTION_KEY", "sk-enc-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o"),
			DBPath:             getEnv("DB_PATH", "./data/translate.db"),
			Port:               getEnv("PORT", "8080"),
			AllowedCORSOrigins: splitCSVEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5170,http://127.0.0.1:5170"),
		}
	})
	return cfg
}

func (c *Config) Validate() error {
	if c.AdminPassword == "" {
		return fmt.Errorf("ADMIN_PASSWORD environment variable is required")
	}
	if strings.EqualFold(c.AdminPassword, "admin") {
		return fmt.Errorf("ADMIN_PASSWORD must not use the default value 'admin'")
	}
	if c.JWTSecret == "" {
		return fmt.Errorf("JWT_SECRET environment variable is required")
	}
	if c.EncryptionKey == "" {
		return fmt.Errorf("ENCRYPTION_KEY environment variable is required")
	}
	if len(c.AllowedCORSOrigins) == 0 {
		return fmt.Errorf("CORS_ALLOWED_ORIGINS must define at least one allowed origin")
	}
	return nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func splitCSVEnv(key, defaultValue string) []string {
	raw := getEnv(key, defaultValue)
	parts := strings.Split(raw, ",")
	origins := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			origins = append(origins, trimmed)
		}
	}
	return origins
}
