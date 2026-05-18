package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/its-rory/translate/backend/internal/middleware"
	"github.com/its-rory/translate/backend/internal/model"
	"github.com/its-rory/translate/backend/internal/service"
)

type PreferenceHandler struct {
	preferenceService *service.PreferenceService
}

func NewPreferenceHandler(preferenceService *service.PreferenceService) *PreferenceHandler {
	return &PreferenceHandler{preferenceService: preferenceService}
}

func (h *PreferenceHandler) Get(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	pref, err := h.preferenceService.GetByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": pref})
}

func (h *PreferenceHandler) Upsert(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req model.PreferenceUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pref, err := h.preferenceService.Upsert(userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": pref})
}
