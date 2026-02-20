package repository

import (
	"context"

	"expense-tracker/internal/model"
)

type GroupRepository interface {
	CreateGroup(ctx context.Context, group *model.Group) error
	GetGroupByID(ctx context.Context, id uint) (*model.Group, error)
	AddUsersToGroup(ctx context.Context, groupID uint, userIDs []uint) error
}

type groupRepository struct {
	db *DB
}

func NewGroupRepository(db *DB) GroupRepository {
	return &groupRepository{db: db}
}

func (r *groupRepository) CreateGroup(ctx context.Context, group *model.Group) error {
	return r.db.WithContext(ctx).Create(group).Error
}

func (r *groupRepository) GetGroupByID(ctx context.Context, id uint) (*model.Group, error) {
	var group model.Group
	if err := r.db.WithContext(ctx).First(&group, id).Error; err != nil {
		return nil, err
	}
	return &group, nil
}

func (r *groupRepository) AddUsersToGroup(ctx context.Context, groupID uint, userIDs []uint) error {
	var members []model.GroupMember
	for _, uid := range userIDs {
		members = append(members, model.GroupMember{
			GroupID: groupID,
			UserID:  uid,
		})
	}
	return r.db.WithContext(ctx).Create(&members).Error
}
