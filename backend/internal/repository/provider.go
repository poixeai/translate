package repository

import (
	"database/sql"
	"fmt"

	"github.com/its-rory/translate/backend/internal/database"
	"github.com/its-rory/translate/backend/internal/model"
	"github.com/its-rory/translate/backend/internal/security"
)

type ProviderRepository struct{}

func NewProviderRepository() *ProviderRepository {
	return &ProviderRepository{}
}

func (r *ProviderRepository) List() ([]model.Provider, error) {
	rows, err := database.DB.Query("SELECT id, name, base_url, api_key, api_style, models, created_at, updated_at FROM providers ORDER BY id")
	if err != nil {
		return nil, fmt.Errorf("failed to list providers: %w", err)
	}
	defer rows.Close()

	var providers []model.Provider
	for rows.Next() {
		provider, err := scanProvider(rows)
		if err != nil {
			return nil, err
		}
		providers = append(providers, *provider)
	}
	return providers, rows.Err()
}

func (r *ProviderRepository) GetByID(id int64) (*model.Provider, error) {
	row := database.DB.QueryRow("SELECT id, name, base_url, api_key, api_style, models, created_at, updated_at FROM providers WHERE id = ?", id)
	provider, err := scanProvider(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get provider by id: %w", err)
	}
	return provider, nil
}

func (r *ProviderRepository) Create(p *model.Provider) error {
	now := model.NowUnix()
	encryptedKey, err := security.EncryptSecret(p.APIKey)
	if err != nil {
		return fmt.Errorf("failed to encrypt provider api key: %w", err)
	}

	result, err := database.DB.Exec(
		"INSERT INTO providers (name, base_url, api_key, api_style, models, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
		p.Name, p.BaseURL, encryptedKey, p.APIStyle, p.Models, now, now,
	)
	if err != nil {
		return fmt.Errorf("failed to create provider: %w", err)
	}
	id, _ := result.LastInsertId()
	p.ID = id
	p.CreatedAt = now
	p.UpdatedAt = now
	return nil
}

func (r *ProviderRepository) Update(p *model.Provider) error {
	now := model.NowUnix()
	encryptedKey, err := security.EncryptSecret(p.APIKey)
	if err != nil {
		return fmt.Errorf("failed to encrypt provider api key: %w", err)
	}

	_, err = database.DB.Exec(
		"UPDATE providers SET name = ?, base_url = ?, api_key = ?, api_style = ?, models = ?, updated_at = ? WHERE id = ?",
		p.Name, p.BaseURL, encryptedKey, p.APIStyle, p.Models, now, p.ID,
	)
	if err != nil {
		return fmt.Errorf("failed to update provider: %w", err)
	}
	p.UpdatedAt = now
	return nil
}

func (r *ProviderRepository) Delete(id int64) error {
	_, err := database.DB.Exec("DELETE FROM providers WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("failed to delete provider: %w", err)
	}
	return nil
}

type providerScanner interface {
	Scan(dest ...any) error
}

func scanProvider(scanner providerScanner) (*model.Provider, error) {
	var p model.Provider
	var encryptedKey string
	if err := scanner.Scan(&p.ID, &p.Name, &p.BaseURL, &encryptedKey, &p.APIStyle, &p.Models, &p.CreatedAt, &p.UpdatedAt); err != nil {
		return nil, err
	}

	apiKey, err := security.DecryptSecret(encryptedKey)
	if err != nil {
		return nil, fmt.Errorf("failed to decrypt provider api key: %w", err)
	}
	p.APIKey = apiKey
	return &p, nil
}
