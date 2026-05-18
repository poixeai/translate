package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"github.com/its-rory/translate/backend/internal/database"
	"github.com/its-rory/translate/backend/internal/service"
)

func setupContractTestDB(t *testing.T) {
	t.Helper()
	gin.SetMode(gin.TestMode)
	t.Setenv("ADMIN_PASSWORD", "StrongerPass123")
	t.Setenv("JWT_SECRET", "test-secret")
	t.Setenv("ENCRYPTION_KEY", "test-encryption-key")

	if err := database.InitDB(filepath.Join(t.TempDir(), "translate-contract.db")); err != nil {
		t.Fatalf("failed to initialize test db: %v", err)
	}
}

func TestAuthHandlerMeReturnsWrappedUser(t *testing.T) {
	setupContractTestDB(t)

	handler := NewAuthHandler(service.NewAuthService())
	writer := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(writer)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	ctx.Set("user_id", int64(1))

	handler.Me(ctx)

	if writer.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d with body %s", writer.Code, writer.Body.String())
	}

	var payload struct {
		User struct {
			ID       int64  `json:"id"`
			Username string `json:"username"`
			Role     string `json:"role"`
		} `json:"user"`
	}
	if err := json.Unmarshal(writer.Body.Bytes(), &payload); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if payload.User.ID != 1 {
		t.Fatalf("expected wrapped user id 1, got %d", payload.User.ID)
	}
	if payload.User.Username == "" {
		t.Fatal("expected wrapped username to be present")
	}
	if payload.User.Role != "ADMIN" {
		t.Fatalf("expected admin role, got %s", payload.User.Role)
	}
}

func TestUserHandlerChangePasswordAcceptsPasswordPayload(t *testing.T) {
	setupContractTestDB(t)

	handler := NewUserHandler(service.NewUserService())
	writer := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(writer)
	ctx.Params = gin.Params{{Key: "id", Value: "1"}}
	ctx.Request = httptest.NewRequest(http.MethodPut, "/api/v1/users/1/password", strings.NewReader(`{"password":"AnotherPass123"}`))
	ctx.Request.Header.Set("Content-Type", "application/json")

	handler.ChangePassword(ctx)

	if writer.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d with body %s", writer.Code, writer.Body.String())
	}
}
