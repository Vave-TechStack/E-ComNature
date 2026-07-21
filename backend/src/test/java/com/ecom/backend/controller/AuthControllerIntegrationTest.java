package com.ecom.backend.controller;

import com.ecom.backend.config.TestSecurityConfig;
import com.ecom.backend.dto.request.*;
import org.springframework.context.annotation.Import;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.AuthResponse;
import com.ecom.backend.entity.User;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.security.RateLimitingFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.*;

/**
 * Full integration test for AuthController using TestRestTemplate.
 * Tests the complete authentication flow end-to-end.
 */
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@Import(TestSecurityConfig.class)
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RateLimitingFilter rateLimitingFilter;

    @Autowired
    private ObjectMapper objectMapper;

    private RestTemplate restTemplate;
    private String baseUrl;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        rateLimitingFilter.reset();
        restTemplate = new RestTemplate();
        baseUrl = "http://localhost:" + port + "/api/v1/auth";
    }

    @Nested
    @DisplayName("Full Registration Flow")
    class RegistrationFlow {

        @Test
        @DisplayName("Should register, login, refresh, and logout successfully")
        void shouldCompleteAuthFlow() throws Exception {
            // Step 1: Register a new user
            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setFirstName("Integration");
            registerRequest.setLastName("Test");
            registerRequest.setEmail("integration@example.com");
            registerRequest.setPhone("9876543210");
            registerRequest.setPassword("Test@1234");

            ResponseEntity<ApiResponse> registerResponse = restTemplate.postForEntity(
                baseUrl + "/register",
                registerRequest,
                ApiResponse.class
            );

            assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(registerResponse.getBody()).isNotNull();
            assertThat(registerResponse.getBody().isSuccess()).isTrue();

            // Verify user exists in database
            User savedUser = userRepository.findByEmailAndIsDeletedFalse("integration@example.com")
                .orElse(null);
            assertThat(savedUser).isNotNull();
            assertThat(savedUser.getFirstName()).isEqualTo("Integration");
            assertThat(savedUser.getRole()).isEqualTo(UserRole.ROLE_CUSTOMER);

            // Step 2: Login with the registered user
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setEmailOrPhone("integration@example.com");
            loginRequest.setPassword("Test@1234");

            ResponseEntity<ApiResponse<AuthResponse>> loginResponse = restTemplate.exchange(
                baseUrl + "/login",
                HttpMethod.POST,
                new HttpEntity<>(loginRequest),
                new ParameterizedTypeReference<ApiResponse<AuthResponse>>() {}
            );

            assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(loginResponse.getBody()).isNotNull();
            assertThat(loginResponse.getBody().getData()).isNotNull();
            assertThat(loginResponse.getBody().getData().getAccessToken()).isNotBlank();
            assertThat(loginResponse.getBody().getData().getRefreshToken()).isNotBlank();

            String accessToken = loginResponse.getBody().getData().getAccessToken();
            String refreshToken = loginResponse.getBody().getData().getRefreshToken();

            // Step 3: Try accessing protected endpoint with the token
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> authRequest = new HttpEntity<>(headers);

            ResponseEntity<String> profileResponse = restTemplate.exchange(
                "http://localhost:" + port + "/api/v1/profile",
                HttpMethod.GET,
                authRequest,
                String.class
            );
            assertThat(profileResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

            // Step 4: Refresh token
            RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
            refreshRequest.setRefreshToken(refreshToken);

            ResponseEntity<ApiResponse<AuthResponse>> refreshResponse = restTemplate.exchange(
                baseUrl + "/refresh",
                HttpMethod.POST,
                new HttpEntity<>(refreshRequest),
                new ParameterizedTypeReference<ApiResponse<AuthResponse>>() {}
            );

            assertThat(refreshResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(refreshResponse.getBody()).isNotNull();
            assertThat(refreshResponse.getBody().getData()).isNotNull();
            assertThat(refreshResponse.getBody().getData().getAccessToken()).isNotBlank();

            // Step 5: Logout
            String newRefreshToken = refreshResponse.getBody().getData().getRefreshToken();
            HttpHeaders logoutHeaders = new HttpHeaders();
            logoutHeaders.set("Authorization", "Bearer " + newRefreshToken);

            ResponseEntity<ApiResponse> logoutResponse = restTemplate.exchange(
                baseUrl + "/logout",
                HttpMethod.POST,
                new HttpEntity<>(logoutHeaders),
                ApiResponse.class
            );

            assertThat(logoutResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test
        @DisplayName("Should reject registration with duplicate email")
        void shouldRejectDuplicateEmail() {
            // Create user directly
            User user = new User();
            user.setFirstName("Existing");
            user.setEmail("existing@example.com");
            user.setPhone("8765432109");
            user.setPassword(passwordEncoder.encode("Test@1234"));
            user.setDisplayName("Existing User");
            user.setRole(UserRole.ROLE_CUSTOMER);
            userRepository.save(user);

            // Try registering with same email
            RegisterRequest request = new RegisterRequest();
            request.setFirstName("Duplicate");
            request.setEmail("existing@example.com");
            request.setPassword("Test@1234");

            assertThatThrownBy(() -> restTemplate.postForEntity(
                baseUrl + "/register", request, ApiResponse.class
            )).isInstanceOf(HttpClientErrorException.class)
              .hasMessageContaining("409");
        }

        @Test
        @DisplayName("Should reject login with wrong password")
        void shouldRejectWrongPassword() {
            // Create user
            User user = new User();
            user.setFirstName("Test");
            user.setEmail("wrongpass@example.com");
            user.setPhone("9988776655");
            user.setPassword(passwordEncoder.encode("Correct@123"));
            user.setDisplayName("Test User");
            user.setRole(UserRole.ROLE_CUSTOMER);
            userRepository.save(user);

            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setEmailOrPhone("wrongpass@example.com");
            loginRequest.setPassword("WrongPassword@123");

            assertThatThrownBy(() -> restTemplate.postForEntity(
                baseUrl + "/login", loginRequest, AuthResponse.class
            )).isInstanceOf(HttpClientErrorException.class)
              .hasMessageContaining("401");
        }
    }

    @Nested
    @DisplayName("Forgot & Reset Password Flow")
    class PasswordResetFlow {

        @Test
        @DisplayName("Should process forgot password request")
        void shouldProcessForgotPassword() {
            // Seed user
            User user = new User();
            user.setFirstName("Forgot");
            user.setEmail("forgot@example.com");
            user.setPhone("9123456780");
            user.setPassword(passwordEncoder.encode("OldPass@123"));
            user.setDisplayName("Forgot User");
            user.setRole(UserRole.ROLE_CUSTOMER);
            userRepository.save(user);

            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmailOrPhone("forgot@example.com");

            ResponseEntity<ApiResponse> response = restTemplate.postForEntity(
                baseUrl + "/forgot-password", request, ApiResponse.class
            );

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().isSuccess()).isTrue();
        }
    }
}
