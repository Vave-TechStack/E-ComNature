package com.ecom.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class OtpService {

    private final StringRedisTemplate redisTemplate;
    private static final String OTP_PREFIX = "otp:";
    private static final int OTP_LENGTH = 6;
    private static final long OTP_EXPIRY_MINUTES = 5;

    public OtpService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateOtp(String key) {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }

        String otpStr = otp.toString();
        redisTemplate.opsForValue().set(
                OTP_PREFIX + key,
                otpStr,
                OTP_EXPIRY_MINUTES,
                TimeUnit.MINUTES
        );

        log.info("OTP generated for {}: {}", key, otpStr);
        return otpStr;
    }

    public boolean verifyOtp(String key, String otp) {
        String storedOtp = redisTemplate.opsForValue().get(OTP_PREFIX + key);
        if (storedOtp == null) {
            log.warn("OTP verification failed - no OTP found for: {}", key);
            return false;
        }

        boolean isValid = storedOtp.equals(otp);
        if (isValid) {
            log.info("OTP verified successfully for: {}", key);
        } else {
            log.warn("OTP verification failed - invalid OTP for: {}", key);
        }
        return isValid;
    }

    public void clearOtp(String key) {
        redisTemplate.delete(OTP_PREFIX + key);
        log.info("OTP cleared for: {}", key);
    }

    public void sendOtpSms(String phone, String otp) {
        // Integration with SMS gateway (Twilio, MSG91, etc.)
        log.info("Sending OTP {} to phone {}", otp, phone);
    }
}
