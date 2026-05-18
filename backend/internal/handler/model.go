package handler

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/its-rory/translate/backend/internal/repository"
)

type ModelHandler struct {
	providerRepo *repository.ProviderRepository
}

func NewModelHandler() *ModelHandler {
	return &ModelHandler{providerRepo: repository.NewProviderRepository()}
}

func (h *ModelHandler) ListByProvider(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid provider id"})
		return
	}

	provider, err := h.providerRepo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if provider == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "provider not found"})
		return
	}

	models := []string{}
	if provider.Models != "" {
		for _, m := range strings.Split(provider.Models, ",") {
			trimmed := strings.TrimSpace(m)
			if trimmed != "" {
				models = append(models, trimmed)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": models})
}
