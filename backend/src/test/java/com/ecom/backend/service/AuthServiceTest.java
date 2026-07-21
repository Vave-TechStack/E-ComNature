package com.ecom.backend.service;

import com.ecom.backend.dto.request.*;
import com.ecom.backend.dto.response.AuthResponse;
import com.ecom.backend.entity.*;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.exception.*;
import com.ecom.backend.repository.*;
import com.ecom.backend.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private LoginHistoryRepository loginHistoryRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private EmailService emailService;
    @Mock private OtpService otpService;

    @Mock private HttpServletRequest httpRequest;

    @InjectMocks private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;
    private RefreshToken refreshToken;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPhone("9876543210");
        registerRequest.setPassword("Password@123");

        loginRequest = new LoginRequest();
        loginRequest.setEmailOrPhone("john@example.com");
        loginRequest.setPassword("Password@123");

        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@example.com");
        user.setPhone("9876543210");
        user.setPassword("encodedPassword");
        user.setDisplayName("John Doe");
        user.setRole(UserRole.ROLE_CUSTOMER);
        user.setReferralCode("ABC123");
        user.setIsEmailVerified(false);
        user.setIsPhoneVerified(false);
        user.setRewardPoints(0);
        user.setWalletBalance(0.0);
        user.setIsAccountLocked(false);
        user.setFailedLoginAttempts(0);

        refreshToken = new RefreshToken();
        refreshToken.setToken("refresh-token-value");
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(30));
        refreshToken.setIsRevoked(false);

        lenient().when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");
        lenient().when(httpRequest.getHeader("User-Agent")).thenReturn("TestAgent");
        lenient().when(httpRequest.getHeader("Device-Info")).thenReturn("TestDevice");
    }

    @Nested
    @DisplayName("Registration Tests")
    class RegisterTests {

        @Test
        @DisplayName("Should register user successfully")
        void shouldRegisterUser() {
            given(userRepository.existsByEmailAndIsDeletedFalse("john@example.com")).willReturn(false);
            given(userRepository.existsByPhoneAndIsDeletedFalse("9876543210")).willReturn(false);
            given(passwordEncoder.encode("Password@123")).willReturn("encodedPassword");
            given(userRepository.save(any(User.class))).willReturn(user);
            given(jwtTokenProvider.generateAccessTokenFromUserId(1L, "john@example.com", "ROLE_CUSTOMER"))
                    .willReturn("access-token");
            given(jwtTokenProvider.generateRefreshToken(1L)).willReturn("refresh-token");
            given(jwtTokenProvider.getAccessTokenExpiration()).willReturn(900000L);

            AuthResponse response = authService.register(registerRequest, httpRequest);

            assertThat(response).isNotNull();
            assertThat(response.getUserId()).isEqualTo(1L);
            assertThat(response.getAccessToken()).isEqualTo("access-token");
            assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
            assertThat(response.getTokenType()).isEqualTo("Bearer");
            assertThat(response.getUser()).isNotNull();
            assertThat(response.getUser().getEmail()).isEqualTo("john@example.com");

            verify(userRepository).save(any(User.class));
            verify(refreshTokenRepository).save(any(RefreshToken.class));
            verify(loginHistoryRepository).save(any(LoginHistory.class));
        }

        @Test
        @DisplayName("Should throw exception when email already exists")
        void shouldThrowExceptionWhenEmailExists() {
            given(userRepository.existsByEmailAndIsDeletedFalse("john@example.com")).willReturn(true);

            assertThatThrownBy(() -> authService.register(registerRequest, httpRequest))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Email already registered");

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when phone already exists")
        void shouldThrowExceptionWhenPhoneExists() {
            given(userRepository.existsByEmailAndIsDeletedFalse("john@example.com")).willReturn(false);
            given(userRepository.existsByPhoneAndIsDeletedFalse("9876543210")).willReturn(true);

            assertThatThrownBy(() -> authService.register(registerRequest, httpRequest))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Phone number already registered");

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should award referral points when referral code is provided")
        void shouldAwardReferralPoints() {
            registerRequest.setReferralCode("REF123");

            User referrer = new User();
            referrer.setId(2L);
            referrer.setRewardPoints(100);
            referrer.setReferralCode("REF123");

            given(userRepository.existsByEmailAndIsDeletedFalse("john@example.com")).willReturn(false);
            given(userRepository.existsByPhoneAndIsDeletedFalse("9876543210")).willReturn(false);
            given(passwordEncoder.encode("Password@123")).willReturn("encodedPassword");
            given(userRepository.findByReferralCodeAndIsDeletedFalse("REF123"))
                    .willReturn(Optional.of(referrer));
            given(userRepository.save(any(User.class))).willReturn(user);
            given(jwtTokenProvider.generateAccessTokenFromUserId(user.getId(), user.getEmail(), user.getRole().name()))
                    .willReturn("access-token");
            given(jwtTokenProvider.generateRefreshToken(anyLong())).willReturn("refresh-token");
            given(jwtTokenProvider.getAccessTokenExpiration()).willReturn(900000L);

            authService.register(registerRequest, httpRequest);

            assertThat(referrer.getRewardPoints()).isEqualTo(150);
            verify(userRepository, times(2)).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Login Tests")
    class LoginTests {

        @Test
        @DisplayName("Should login successfully with email")
        void shouldLoginWithEmail() {
            given(userRepository.findByEmailAndIsDeletedFalse("john@example.com"))
                    .willReturn(Optional.of(user));
            given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .willReturn(mock(Authentication.class));
            given(jwtTokenProvider.generateAccessToken(any(Authentication.class)))
                    .willReturn("access-token");
            given(jwtTokenProvider.generateRefreshToken(1L)).willReturn("refresh-token");
            given(jwtTokenProvider.getAccessTokenExpiration()).willReturn(900000L);

            AuthResponse response = authService.login(loginRequest, httpRequest);

            assertThat(response).isNotNull();
            assertThat(response.getUserId()).isEqualTo(1L);
            verify(loginHistoryRepository).save(any(LoginHistory.class));
        }

        @Test
        @DisplayName("Should login successfully with phone")
        void shouldLoginWithPhone() {
            loginRequest.setEmailOrPhone("9876543210");
            given(userRepository.findByEmailAndIsDeletedFalse("9876543210")).willReturn(Optional.empty());
            given(userRepository.findByPhoneAndIsDeletedFalse("9876543210"))
                    .willReturn(Optional.of(user));
            given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .willReturn(mock(Authentication.class));
            given(jwtTokenProvider.generateAccessToken(any(Authentication.class)))
                    .willReturn("access-token");
            given(jwtTokenProvider.generateRefreshToken(1L)).willReturn("refresh-token");
            given(jwtTokenProvider.getAccessTokenExpiration()).willReturn(900000L);

            AuthResponse response = authService.login(loginRequest, httpRequest);

            assertThat(response).isNotNull();
            assertThat(response.getUserId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should throw exception when credentials are invalid")
        void shouldThrowExceptionForInvalidCredentials() {
            given(userRepository.findByEmailAndIsDeletedFalse("john@example.com"))
                    .willReturn(Optional.of(user));
            given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .willThrow(new BadCredentialsException("Invalid credentials"));

            assertThatThrownBy(() -> authService.login(loginRequest, httpRequest))
                    .isInstanceOf(BadCredentialsException.class);
        }

        @Test
        @DisplayName("Should lock account after max failed attempts")
        void shouldLockAccountAfterMaxFailedAttempts() {
            user.setFailedLoginAttempts(4);

            given(userRepository.findByEmailAndIsDeletedFalse("john@example.com"))
                    .willReturn(Optional.of(user));
            given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .willThrow(new BadCredentialsException("Invalid credentials"));

            assertThatThrownBy(() -> authService.login(loginRequest, httpRequest))
                    .isInstanceOf(BadCredentialsException.class);

            assertThat(user.getFailedLoginAttempts()).isEqualTo(5);
            assertThat(user.getIsAccountLocked()).isTrue();
            assertThat(user.getLockoutEnd()).isNotNull();
        }

        @Test
        @DisplayName("Should allow login after lockout period expires")
        void shouldAllowLoginAfterLockoutExpires() {
            user.setIsAccountLocked(true);
            user.setLockoutEnd(LocalDateTime.now().minusMinutes(1));
            user.setFailedLoginAttempts(5);

            given(userRepository.findByEmailAndIsDeletedFalse("john@example.com"))
                    .willReturn(Optional.of(user));
            given(userRepository.save(any(User.class))).willAnswer(invocation -> {
                User savedUser = invocation.getArgument(0);
                savedUser.setIsAccountLocked(false);
                savedUser.setFailedLoginAttempts(0);
                savedUser.setLockoutEnd(null);
                return savedUser;
            });
            given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .willReturn(mock(Authentication.class));
            given(jwtTokenProvider.generateAccessToken(any(Authentication.class)))
                    .willReturn("access-token");
            given(jwtTokenProvider.generateRefreshToken(1L)).willReturn("refresh-token");
            given(jwtTokenProvider.getAccessTokenExpiration()).willReturn(900000L);

            AuthResponse response = authService.login(loginRequest, httpRequest);

            assertThat(response).isNotNull();
            assertThat(response.getUserId()).isEqualTo(1L);
            verify(userRepository, atLeastOnce()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Token Refresh Tests")
    class RefreshTokenTests {

        @Test
        @DisplayName("Should refresh token successfully")
        void shouldRefreshToken() {
            RefreshTokenRequest request = new RefreshTokenRequest();
            request.setRefreshToken("valid-refresh-token");

            given(refreshTokenRepository.findByTokenAndIsRevokedFalse("valid-refresh-token"))
                    .willReturn(Optional.of(refreshToken));
            given(jwtTokenProvider.generateAccessTokenFromUserId(1L, "john@example.com", "ROLE_CUSTOMER"))
                    .willReturn("new-access-token");
            given(jwtTokenProvider.generateRefreshToken(1L)).willReturn("new-refresh-token");
            given(jwtTokenProvider.getAccessTokenExpiration()).willReturn(900000L);

            AuthResponse response = authService.refreshToken(request, httpRequest);

            assertThat(response.getAccessToken()).isEqualTo("new-access-token");
            assertThat(response.getRefreshToken()).isEqualTo("new-refresh-token");
            assertThat(refreshToken.getIsRevoked()).isTrue();
        }

        @Test
        @DisplayName("Should throw exception when refresh token is invalid")
        void shouldThrowExceptionForInvalidToken() {
            RefreshTokenRequest request = new RefreshTokenRequest();
            request.setRefreshToken("invalid-token");

            given(refreshTokenRepository.findByTokenAndIsRevokedFalse("invalid-token"))
                    .willReturn(Optional.empty());

            assertThatThrownBy(() -> authService.refreshToken(request, httpRequest))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Invalid or expired refresh token");
        }

        @Test
        @DisplayName("Should throw exception when refresh token is expired")
        void shouldThrowExceptionForExpiredToken() {
            refreshToken.setExpiresAt(LocalDateTime.now().minusDays(1));

            RefreshTokenRequest request = new RefreshTokenRequest();
            request.setRefreshToken("expired-token");

            given(refreshTokenRepository.findByTokenAndIsRevokedFalse("expired-token"))
                    .willReturn(Optional.of(refreshToken));

            assertThatThrownBy(() -> authService.refreshToken(request, httpRequest))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("has expired");
        }
    }

    @Nested
    @DisplayName("Logout Tests")
    class LogoutTests {

        @Test
        @DisplayName("Should revoke refresh token on logout")
        void shouldRevokeTokenOnLogout() {
            given(refreshTokenRepository.findByTokenAndIsRevokedFalse("valid-token"))
                    .willReturn(Optional.of(refreshToken));

            authService.logout("valid-token");

            assertThat(refreshToken.getIsRevoked()).isTrue();
            assertThat(refreshToken.getRevokedAt()).isNotNull();
        }

        @Test
        @DisplayName("Should not throw when logging out with invalid token")
        void shouldNotThrowForInvalidToken() {
            given(refreshTokenRepository.findByTokenAndIsRevokedFalse("invalid-token"))
                    .willReturn(Optional.empty());

            assertThatCode(() -> authService.logout("invalid-token"))
                    .doesNotThrowAnyException();
        }
    }

    @Nested
    @DisplayName("OTP Tests")
    class OtpTests {

        @Test
        @DisplayName("Should generate and send OTP")
        void shouldGenerateAndSendOtp() {
            given(userRepository.findByPhoneAndIsDeletedFalse("9876543210"))
                    .willReturn(Optional.of(user));
            given(otpService.generateOtp("9876543210")).willReturn("123456");

            authService.sendOtp("9876543210");

            verify(otpService).generateOtp("9876543210");
            verify(otpService).sendOtpSms("9876543210", "123456");
        }

        @Test
        @DisplayName("Should create new user when phone not found for OTP")
        void shouldCreateUserWhenPhoneNotFound() {
            given(userRepository.findByPhoneAndIsDeletedFalse("9999999999"))
                    .willReturn(Optional.empty());
            given(userRepository.save(any(User.class))).willAnswer(invocation -> invocation.getArgument(0));
            given(otpService.generateOtp("9999999999")).willReturn("123456");

            authService.sendOtp("9999999999");

            verify(userRepository).save(any(User.class));
            verify(otpService).sendOtpSms("9999999999", "123456");
        }

        @Test
        @DisplayName("Should verify OTP successfully")
        void shouldVerifyOtp() {
            OtpVerifyRequest request = new OtpVerifyRequest();
            request.setPhone("9876543210");
            request.setOtp("123456");

            given(otpService.verifyOtp("9876543210", "123456")).willReturn(true);
            given(userRepository.findByPhoneAndIsDeletedFalse("9876543210"))
                    .willReturn(Optional.of(user));
            given(jwtTokenProvider.generateAccessTokenFromUserId(1L, "john@example.com", "ROLE_CUSTOMER"))
                    .willReturn("access-token");
            given(jwtTokenProvider.generateRefreshToken(1L)).willReturn("refresh-token");
            given(jwtTokenProvider.getAccessTokenExpiration()).willReturn(900000L);

            AuthResponse response = authService.verifyOtp(request, httpRequest);

            assertThat(response).isNotNull();
            assertThat(user.getIsPhoneVerified()).isTrue();
            verify(otpService).clearOtp("9876543210");
        }

        @Test
        @DisplayName("Should throw exception when OTP is invalid")
        void shouldThrowExceptionForInvalidOtp() {
            OtpVerifyRequest request = new OtpVerifyRequest();
            request.setPhone("9876543210");
            request.setOtp("000000");

            given(otpService.verifyOtp("9876543210", "000000")).willReturn(false);

            assertThatThrownBy(() -> authService.verifyOtp(request, httpRequest))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Invalid or expired OTP");
        }
    }

    @Nested
    @DisplayName("Password Reset Tests")
    class PasswordResetTests {

        @Test
        @DisplayName("Should initiate forgot password flow")
        void shouldInitiateForgotPassword() {
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmailOrPhone("john@example.com");

            given(userRepository.findByEmailAndIsDeletedFalse("john@example.com"))
                    .willReturn(Optional.of(user));

            authService.forgotPassword(request);

            verify(emailService).sendPasswordResetEmail(eq("john@example.com"), eq("John"), anyString());
        }

        @Test
        @DisplayName("Should throw exception when user not found for forgot password")
        void shouldThrowExceptionWhenUserNotFound() {
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmailOrPhone("unknown@example.com");

            given(userRepository.findByEmailAndIsDeletedFalse("unknown@example.com"))
                    .willReturn(Optional.empty());
            given(userRepository.findByPhoneAndIsDeletedFalse("unknown@example.com"))
                    .willReturn(Optional.empty());

            assertThatThrownBy(() -> authService.forgotPassword(request))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }
}
