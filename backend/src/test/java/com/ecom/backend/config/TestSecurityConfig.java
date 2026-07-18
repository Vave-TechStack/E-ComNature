package com.ecom.backend.config;

import com.ecom.backend.entity.User;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.security.JwtTokenProvider;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Test configuration that provides helper methods for integration tests.
 * This config works with the default application-test.yml settings.
 */
@TestConfiguration
public class TestSecurityConfig {

    /**
     * Creates a test user and returns a valid JWT token for it.
     */
    public static String createTestToken(JwtTokenProvider jwtTokenProvider, String role) {
        return jwtTokenProvider.generateAccessTokenFromUserId(1L, "test@example.com", role);
    }

    /**
     * Seeds a test user into the database.
     */
    public static User seedTestUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        User user = new User();
        user.setId(1L);
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@example.com");
        user.setPhone("9876543210");
        user.setPassword(passwordEncoder.encode("Password@123"));
        user.setDisplayName("Test User");
        user.setRole(UserRole.ROLE_CUSTOMER);
        user.setReferralCode("TEST123");
        user.setIsEmailVerified(true);
        user.setIsPhoneVerified(false);
        user.setRewardPoints(0);
        user.setWalletBalance(0.0);
        user.setIsActive(true);
        user.setIsDeleted(false);
        return userRepository.save(user);
    }
}
