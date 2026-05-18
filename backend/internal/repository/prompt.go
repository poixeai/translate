package repository

import (
	"database/sql"
	"fmt"

	"github.com/its-rory/translate/backend/internal/database"
	"github.com/its-rory/translate/backend/internal/model"
)

type PromptRepository struct{}

func NewPromptRepository() *PromptRepository {
	return &PromptRepository{}
}

func (r *PromptRepository) List() ([]model.TranslationPrompt, error) {
	rows, err := database.DB.Query("SELECT id, name, content, is_system, created_at, updated_at FROM translation_prompts ORDER BY id")
	if err != nil {
		return nil, fmt.Errorf("failed to list prompts: %w", err)
	}
	defer rows.Close()

	var prompts []model.TranslationPrompt
	for rows.Next() {
		var p model.TranslationPrompt
		var isSystem int
		if err := rows.Scan(&p.ID, &p.Name, &p.Content, &isSystem, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan prompt: %w", err)
		}
		p.IsSystem = isSystem == 1
		prompts = append(prompts, p)
	}
	return prompts, rows.Err()
}

func (r *PromptRepository) GetByID(id int64) (*model.TranslationPrompt, error) {
	var p model.TranslationPrompt
	var isSystem int
	err := database.DB.QueryRow("SELECT id, name, content, is_system, created_at, updated_at FROM translation_prompts WHERE id = ?", id).
		Scan(&p.ID, &p.Name, &p.Content, &isSystem, &p.CreatedAt, &p.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get prompt by id: %w", err)
	}
	p.IsSystem = isSystem == 1
	return &p, nil
}

func (r *PromptRepository) Create(p *model.TranslationPrompt) error {
	now := model.NowUnix()
	isSystem := 0
	if p.IsSystem {
		isSystem = 1
	}
	result, err := database.DB.Exec(
		"INSERT INTO translation_prompts (name, content, is_system, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
		p.Name, p.Content, isSystem, now, now,
	)
	if err != nil {
		return fmt.Errorf("failed to create prompt: %w", err)
	}
	id, _ := result.LastInsertId()
	p.ID = id
	p.CreatedAt = now
	p.UpdatedAt = now
	return nil
}

func (r *PromptRepository) Update(p *model.TranslationPrompt) error {
	now := model.NowUnix()
	_, err := database.DB.Exec(
		"UPDATE translation_prompts SET name = ?, content = ?, updated_at = ? WHERE id = ?",
		p.Name, p.Content, now, p.ID,
	)
	if err != nil {
		return fmt.Errorf("failed to update prompt: %w", err)
	}
	p.UpdatedAt = now
	return nil
}

func (r *PromptRepository) Delete(id int64) error {
	_, err := database.DB.Exec("DELETE FROM translation_prompts WHERE id = ? AND is_system = 0", id)
	if err != nil {
		return fmt.Errorf("failed to delete prompt: %w", err)
	}
	return nil
}
