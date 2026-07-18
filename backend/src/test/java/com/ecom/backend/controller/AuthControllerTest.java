package com.ecom.backend.controller;

import com.ecom.backend.dto.request.*;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.AuthResponse;
import com.ecom.backend.dto.response.UserDto;
import com.ecom.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private AuthService authService;
    @Mock private HttpServletRequest httpRequest;

    @InjectMocks private AuthController authController;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private AuthResponse authResponse;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        userDto = UserDto.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .role("ROLE_CUSTOMER")
                .build();

        authResponse = AuthResponse.builder()
                .userId(1L)
                .accessToken("access-token")
                .refreshToken("refresh-token")
                .tokenType("Bearer")
                .expiresIn(900)
                .user(userDto)
                .build();

        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPassword("Password@123");

        loginRequest = new LoginRequest();
        loginRequest.setEmailOrPhone("john@example.com");
        loginRequest.setPassword("Password@123");
    }

    @Nested
    @DisplayName("Register Endpoint")
    class RegisterEndpoint {

        @Test
        @DisplayName("Should register user and return 201")
        void shouldRegister() {
            given(authService.register(any(RegisterRequest.class), any(HttpServletRequest.class)))
                    .willReturn(authResponse);

            ResponseEntity<ApiResponse<AuthResponse>> response = authController.register(registerRequest, httpRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().isSuccess()).isTrue();
            assertThat(response.getBody().getMessage()).isEqualTo("Registration successful");
            assertThat(response.getBody().getData().getAccessToken()).isEqualTo("access-token");
        }
    }

    @Nested
    @DisplayName("Login Endpoint")
    class LoginEndpoint {

        @Test
        @DisplayName("Should login user and return 200")
        void shouldLogin() {
            given(authService.login(any(LoginRequest.class), any(HttpServletRequest.class)))
                    .willReturn(authResponse);

            ResponseEntity<ApiResponse<AuthResponse>> response = authController.login(loginRequest, httpRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().isSuccess()).isTrue();
            assertThat(response.getBody().getMessage()).isEqualTo("Login successful");
        }
    }

    @Nested
    @DisplayName("Refresh Token Endpoint")
    class RefreshTokenEndpoint {

        @Test
        @DisplayName("Should refresh token and return 200")
        void shouldRefreshToken() {
            RefreshTokenRequest request = new RefreshTokenRequest();
            request.setRefreshToken("refresh-token");

            given(authService.refreshToken(any(RefreshTokenRequest.class), any(HttpServletRequest.class)))
                    .willReturn(authResponse);

            ResponseEntity<ApiResponse<AuthResponse>> response = authController.refreshToken(request, httpRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Token refreshed successfully");
        }
    }

    @Nested
    @DisplayName("Logout Endpoint")
    class LogoutEndpoint {

        @Test
        @DisplayName("Should logout user and return 200")
        void shouldLogout() {
            ResponseEntity<ApiResponse<Void>> response = authController.logout("Bearer refresh-token");

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().isSuccess()).isTrue();
            assertThat(response.getBody().getMessage()).isEqualTo("Logged out successfully");
            verify(authService).logout("refresh-token");
        }
    }

    @Nested
    @DisplayName("OTP Endpoints")
    class OtpEndpoints {

        @Test
        @DisplayName("Should send OTP and return 200")
        void shouldSendOtp() {
            OtpRequest request = new OtpRequest();
            request.setPhone("9876543210");

            ResponseEntity<ApiResponse<Void>> response = authController.sendOtp(request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(authService).sendOtp("9876543210");
        }

        @Test
        @DisplayName("Should verify OTP and return 200")
        void shouldVerifyOtp() {
            OtpVerifyRequest request = new OtpVerifyRequest();
            request.setPhone("9876543210");
            request.setOtp("123456");

            given(authService.verifyOtp(any(OtpVerifyRequest.class), any(HttpServletRequest.class)))
                    .willReturn(authResponse);

            ResponseEntity<ApiResponse<AuthResponse>> response = authController.verifyOtp(request, httpRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getMessage()).isEqualTo("OTP verified successfully");
        }
    }

    @Nested
    @DisplayName("Password Reset Endpoints")
    class PasswordResetEndpoints {

        @Test
        @DisplayName("Should initiate forgot password and return 200")
        void shouldForgotPassword() {
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmailOrPhone("john@example.com");

            ResponseEntity<ApiResponse<Void>> response = authController.forgotPassword(request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(authService).forgotPassword(request);
        }

        @Test
        @DisplayName("Should reset password and return 200")
        void shouldResetPassword() {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("reset-token");
            request.setNewPassword("NewPassword@123");

            ResponseEntity<ApiResponse<Void>> response = authController.resetPassword(request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(authService).resetPassword(request);
        }
    }
}
