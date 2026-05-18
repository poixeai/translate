package repository

import (
	"database/sql"
	"fmt"

	"github.com/its-rory/translate/backend/internal/database"
	"github.com/its-rory/translate/backend/internal/model"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (r *UserRepository) List() ([]model.User, error) {
	rows, err := database.DB.Query("SELECT id, username, password_hash, role, display_name, email, avatar_url, created_at, updated_at FROM users ORDER BY id")
	if err != nil {
		return nil, fmt.Errorf("failed to list users: %w", err)
	}
	defer rows.Close()

	var users []model.User
	for rows.Next() {
		var u model.User
		if err := rows.Scan(&u.ID, &u.Username, &u.PasswordHash, &u.Role, &u.DisplayName, &u.Email, &u.AvatarURL, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, u)
	}
	return users, rows.Err()
}

func (r *UserRepository) GetByID(id int64) (*model.User, error) {
	var u model.User
	err := database.DB.QueryRow("SELECT id, username, password_hash, role, display_name, email, avatar_url, created_at, updated_at FROM users WHERE id = ?", id).
		Scan(&u.ID, &u.Username, &u.PasswordHash, &u.Role, &u.DisplayName, &u.Email, &u.AvatarURL, &u.CreatedAt, &u.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}
	return &u, nil
}

func (r *UserRepository) GetByUsername(username string) (*model.User, error) {
	var u model.User
	err := database.DB.QueryRow("SELECT id, username, password_hash, role, display_name, email, avatar_url, created_at, updated_at FROM users WHERE username = ?", username).
		Scan(&u.ID, &u.Username, &u.PasswordHash, &u.Role, &u.DisplayName, &u.Email, &u.AvatarURL, &u.CreatedAt, &u.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return &u, nil
}

func (r *UserRepository) Create(u *model.User) error {
	now := model.NowUnix()
	result, err := database.DB.Exec(
		"INSERT INTO users (username, password_hash, role, display_name, email, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		u.Username, u.PasswordHash, u.Role, u.DisplayName, u.Email, u.AvatarURL, now, now,
	)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	id, _ := result.LastInsertId()
	u.ID = id
	u.CreatedAt = now
	u.UpdatedAt = now
	return nil
}

func (r *UserRepository) Update(u *model.User) error {
	now := model.NowUnix()
	_, err := database.DB.Exec(
		"UPDATE users SET role = ?, display_name = ?, email = ?, avatar_url = ?, updated_at = ? WHERE id = ?",
		u.Role, u.DisplayName, u.Email, u.AvatarURL, now, u.ID,
	)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}
	u.UpdatedAt = now
	return nil
}

func (r *UserRepository) UpdatePassword(id int64, passwordHash string) error {
	_, err := database.DB.Exec(
		"UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
		passwordHash, model.NowUnix(), id,
	)
	if err != nil {
		return fmt.Errorf("failed to update user password: %w", err)
	}
	return nil
}

func (r *UserRepository) Delete(id int64) error {
	_, err := database.DB.Exec("DELETE FROM users WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}
	return nil
}
