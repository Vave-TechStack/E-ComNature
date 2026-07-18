package com.ecom.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendEmail(String to, String subject, String templateName, Context context) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String htmlContent = templateEngine.process(templateName, context);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom("noreply@ecomnature.com");

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String to, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        sendEmail(to, "Welcome to EcomNature!", "welcome-email", context);
    }

    @Async
    public void sendOrderConfirmation(String to, String name, String orderNumber) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("orderNumber", orderNumber);
        sendEmail(to, "Order Confirmed - " + orderNumber, "order-confirmation", context);
    }

    @Async
    public void sendPasswordResetEmail(String to, String name, String resetToken) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("resetToken", resetToken);
        context.setVariable("resetUrl", "https://ecomnature.com/auth/reset-password?token=" + resetToken);
        sendEmail(to, "Reset Your Password", "password-reset", context);
    }

    @Async
    public void sendShipmentUpdate(String to, String name, String orderNumber, String status) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("orderNumber", orderNumber);
        context.setVariable("status", status);
        sendEmail(to, "Order Update - " + orderNumber, "shipment-update", context);
    }
}
