package repositories

import (
	"coworkspace/db"
	"coworkspace/dto"
	"coworkspace/models"
	"database/sql"
)

type SpaceRepository struct {
	DB *sql.DB
}

var SpaceRepo *SpaceRepository

func (r *SpaceRepository) Create(space *models.Space) error {

	query := `
	INSERT INTO space
	(name, type, capacity, location_label, plan_image)
	VALUES ($1,$2,$3,$4,$5)
	RETURNING id
	`

	return db.DB.QueryRow(
		query,
		space.Name,
		space.Type,
		space.Capacity,
		space.LocationLabel,
		space.PlanImage,
	).Scan(&space.ID)
}


func (r *SpaceRepository) GetAll() ([]models.Space, error) {

	rows, err := r.DB.Query(`
	SELECT id, name, type, capacity, location_label, plan_image, is_active, created_at, updated_at
	FROM space
	ORDER BY id ASC
	`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    spaces := []models.Space{}
    for rows.Next() {
        var s models.Space
        err := rows.Scan(
            &s.ID,
            &s.Name,
            &s.Type,
            &s.Capacity,
            &s.LocationLabel,
            &s.PlanImage,
            &s.IsActive,
            &s.CreatedAt,
            &s.UpdatedAt,
        )
        if err != nil {
            return nil, err
        }
        spaces = append(spaces, s)
    }

    return spaces, nil
}

func (r *SpaceRepository) GetActive() ([]models.Space, error) {

	rows, err := r.DB.Query(`
	SELECT id, name, type, capacity, location_label, plan_image, is_active, created_at, updated_at
	FROM space
	WHERE is_active = true
	ORDER BY id ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	spaces := []models.Space{}

	for rows.Next() {
		var s models.Space

		err := rows.Scan(
			&s.ID,
			&s.Name,
			&s.Type,
			&s.Capacity,
			&s.LocationLabel,
			&s.PlanImage,
			&s.IsActive,
			&s.CreatedAt,
			&s.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		spaces = append(spaces, s)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return spaces, nil
}


func (repo *SpaceRepository) GetByID(id int) (*models.Space, error) {
    space := &models.Space{}
    query := `SELECT id, name, type, capacity, location_label, plan_image, is_active, created_at, updated_at
              FROM space WHERE id = $1`

    row := repo.DB.QueryRow(query, id)
    err := row.Scan(&space.ID, &space.Name, &space.Type, &space.Capacity, &space.LocationLabel,
                    &space.PlanImage, &space.IsActive, &space.CreatedAt, &space.UpdatedAt)
    if err != nil {
        return nil, err
    }

    return space, nil
}


func (repo *SpaceRepository) Update(space models.Space) error {
    query := `
        UPDATE space
        SET name = $1,
            type = $2,
            capacity = $3,
            location_label = $4,
            plan_image = $5,
            is_active = $6,
            updated_at = NOW()
        WHERE id = $7
    `
    _, err := repo.DB.Exec(
        query,
        space.Name,
        space.Type,
        space.Capacity,
        space.LocationLabel,
        space.PlanImage,
        space.IsActive,
        space.ID,
    )
    return err
}

func (repo *SpaceRepository) Delete(id int) error {
    _, err := repo.DB.Exec(`DELETE FROM space WHERE id = $1`, id)
    return err
}

func (r *SpaceRepository) GetFullSpace(id int) (*dto.SpaceFullResponse, error) {

    space, err := r.GetByID(id)
    if err != nil {
        return nil, err
    }

    desks, err := DeskRepo.GetBySpaceID(id)
    if err != nil {
        return nil, err
    }

    equipments, err := EquipmentRepo.GetBySpaceID(id)
    if err != nil {
        return nil, err
    }

    result := &dto.SpaceFullResponse{
        Space:      *space,
        Desks:      desks,
        Equipments: equipments,
    }

    return result, nil
}