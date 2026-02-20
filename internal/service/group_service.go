package service

import (
	"context"

	"expense-tracker/internal/model"
	"expense-tracker/internal/repository"
)

type GroupService interface {
	CreateGroup(ctx context.Context, title string, description string) (*model.Group, error)
	GetGroup(ctx context.Context, id uint) (*model.Group, error)
}

type groupService struct {
	repo repository.GroupRepository
}

func NewGroupService(repo repository.GroupRepository) GroupService {
	return &groupService{repo: repo}
}

func (s *groupService) CreateGroup(ctx context.Context, title string, description string) (*model.Group, error) {
	group := &model.Group{
		Title:       title,
		Description: description,
	}

	if err := s.repo.CreateGroup(ctx, group); err != nil {
		return nil, err
	}

	return group, nil
}

func (s *groupService) GetGroup(ctx context.Context, id uint) (*model.Group, error) {
	return s.repo.GetGroupByID(ctx, id)
}
