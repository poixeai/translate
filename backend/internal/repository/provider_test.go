package repository

import (
	"path/filepath"
	"testing"

	"github.com/its-rory/translate/backend/internal/database"
	"github.com/its-rory/translate/backend/internal/model"
)

func setupProviderRepoTestDB(t *testing.T) {
	t.Helper()
	t.Setenv("ADMIN_PASSWORD", "StrongerPass123")
	t.Setenv("JWT_SECRET", "test-secret")
	t.Setenv("ENCRYPTION_KEY", "test-encryption-key")

	if err := database.InitDB(filepath.Join(t.TempDir(), "provider-repo.db")); err != nil {
		t.Fatalf("failed to initialize provider test db: %v", err)
	}
}

func TestProviderRepositoryEncryptsAPIKeysAtRest(t *testing.T) {
	setupProviderRepoTestDB(t)
	repo := NewProviderRepository()

	provider := &model.Provider{
		Name:     "Encrypted Provider",
		BaseURL:  "https://api.example.com",
		APIKey:   "super-secret-key",
		APIStyle: "openai_completions",
		Models:   "gpt-4o-mini",
	}

	if err := repo.Create(provider); err != nil {
		t.Fatalf("failed to create provider: %v", err)
	}

	var storedValue string
	if err := database.DB.QueryRow("SELECT api_key FROM providers WHERE id = ?", provider.ID).Scan(&storedValue); err != nil {
		t.Fatalf("failed to query raw api key: %v", err)
	}
	if storedValue == provider.APIKey {
		t.Fatal("expected api key to be encrypted at rest")
	}

	loaded, err := repo.GetByID(provider.ID)
	if err != nil {
		t.Fatalf("failed to load provider: %v", err)
	}
	if loaded == nil || loaded.APIKey != "super-secret-key" {
		t.Fatalf("expected decrypted api key, got %#v", loaded)
	}
}
