package repositories

import (
	"coworkspace/db"
	"coworkspace/models"
	"database/sql"
)

type EquipmentRepository struct {
    DB *sql.DB
}

var EquipmentRepo *EquipmentRepository

func (r *EquipmentRepository) Create(e models.Equipment) error {
    query := `
        INSERT INTO equipment (name, quantity, space_id, description)
        VALUES ($1,$2,$3,$4)
        RETURNING id
    `
    return db.DB.QueryRow(query, e.Name, e.Quantity, e.SpaceID, e.Description).Scan(&e.ID)
}

func (r *EquipmentRepository) GetAll() ([]models.Equipment, error) {
    rows, err := db.DB.Query(`
        SELECT id, name, quantity, space_id, description, created_at, updated_at
        FROM equipment ORDER BY id ASC
    `)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    equipments := []models.Equipment{}
    for rows.Next() {
        var e models.Equipment
        if err := rows.Scan(&e.ID, &e.Name, &e.Quantity, &e.SpaceID, &e.Description, &e.CreatedAt, &e.UpdatedAt); err != nil {
            return nil, err
        }
        equipments = append(equipments, e)
    }
    return equipments, nil
}

func (r *EquipmentRepository) GetByID(id int) (*models.Equipment, error) {
    e := &models.Equipment{}
    row := r.DB.QueryRow(`
        SELECT id, name, quantity, space_id, description, created_at, updated_at
        FROM equipment WHERE id = $1
    `, id)
    if err := row.Scan(&e.ID, &e.Name, &e.Quantity, &e.SpaceID, &e.Description, &e.CreatedAt, &e.UpdatedAt); err != nil {
        return nil, err
    }
    return e, nil
}

func (r *EquipmentRepository) Update(e models.Equipment) error {
    _, err := r.DB.Exec(`
        UPDATE equipment
        SET name=$1, quantity=$2, space_id=$3, description=$4, updated_at=NOW()
        WHERE id=$5
    `, e.Name, e.Quantity, e.SpaceID, e.Description, e.ID)
    return err
}

func (r *EquipmentRepository) Delete(id int) error {
    _, err := r.DB.Exec(`DELETE FROM equipment WHERE id=$1`, id)
    return err
}

func (r *EquipmentRepository) GetBySpaceID(spaceID int) ([]models.Equipment, error) {

	rows, err := r.DB.Query(`
		SELECT id, name, quantity, space_id, description, created_at, updated_at
		FROM equipment
		WHERE space_id = $1
		ORDER BY id ASC
	`, spaceID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	equipments := []models.Equipment{}

	for rows.Next() {
		var e models.Equipment

		err := rows.Scan(
			&e.ID,
			&e.Name,
			&e.Quantity,
			&e.SpaceID,
			&e.Description,
			&e.CreatedAt,
			&e.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		equipments = append(equipments, e)
	}

	return equipments, nil
}