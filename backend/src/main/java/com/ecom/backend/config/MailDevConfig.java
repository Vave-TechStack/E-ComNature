package com.ecom.backend.config;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * Development configuration that provides a mock JavaMailSender bean
 * so the application starts without a real SMTP server.
 * The TemplateEngine is already auto-configured by Thymeleaf.
 */
@Configuration
public class MailDevConfig {

    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    public JavaMailSender javaMailSender() {
        return new JavaMailSenderImpl() {
            @Override
            public MimeMessage createMimeMessage() {
                return new MimeMessage(Session.getDefaultInstance(System.getProperties()));
            }

            @Override
            public void send(MimeMessage... mimeMessages) {
                // No-op: skip sending emails in development
            }
        };
    }
}
