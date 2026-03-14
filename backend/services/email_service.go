package services

import (
	"coworkspace/config"
	"fmt"
	"net/smtp"
)



func SendVerificationEmail(email string, token string) error {

	link := fmt.Sprintf(
		"http://localhost:8080/verify-email?token=%s",
		token,
	)

	message := []byte(
		"Subject: Email Verification\r\n\r\n" +
			"Click the link to verify your email:\r\n" +
			link,
	)

	auth := smtp.PlainAuth(
		"",
		config.Cfg.SMTPEmail,
		config.Cfg.SMTPPassword,
		config.Cfg.SMTPHost,
	)

	smtpAddr := fmt.Sprintf("%s:%s", config.Cfg.SMTPHost, config.Cfg.SMTPPort)
	

	return smtp.SendMail(
		smtpAddr,
		auth,
		config.Cfg.SMTPEmail,
		[]string{email},
		message,
	)
}