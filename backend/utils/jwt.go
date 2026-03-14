package utils

import (
	"coworkspace/config"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// ----- CREATETOKEN -----  crée un JWT pour un utilisateur donné
func CreateToken(userID uint, role string, duration time.Duration) (string, error) {
	// claim -> body du JWT
	claims := jwt.MapClaims{
		"user_id": userID,
		"role": role,
		"exp": time.Now().Add(duration).Unix(),
	}

	// Création du token avec la méthode de signature HS256 et les claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Retourne le token signé sous forme de string et une erreur si ça échoue
	return token.SignedString([]byte(config.Cfg.JWTSecret))
}

func ParseToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.Cfg.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("token invalide")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("format du token invalide")
	}

	exp := int64(claims["exp"].(float64))
	if time.Now().Unix() > exp {
		return nil, errors.New("TOKEN_EXPIRED")
	}

	return claims, nil
}