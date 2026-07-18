package com.ecom.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    private static final String TEST_SECRET = "dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdG9rZW4tZ2VuZXJhdGlvbi10ZXN0aW5nLTAxMjM0NTY3ODk=";
    private static final long ACCESS_TOKEN_EXPIRATION = 3600000L; // 1 hour
    private static final long REFRESH_TOKEN_EXPIRATION = 86400000L; // 1 day

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtTokenProvider, "accessTokenExpiration", ACCESS_TOKEN_EXPIRATION);
        ReflectionTestUtils.setField(jwtTokenProvider, "refreshTokenExpiration", REFRESH_TOKEN_EXPIRATION);
        jwtTokenProvider.init();
    }

    @Nested
    @DisplayName("Access Token Generation Tests")
    class AccessTokenGenerationTests {

        @Test
        @DisplayName("Should generate access token from Authentication")
        void shouldGenerateAccessTokenFromAuthentication() {
            UserPrincipal userPrincipal = new UserPrincipal(
                    1L, "test@example.com", "9876543210",
                    "password", "Test", "User",
                    com.ecom.backend.entity.enums.UserRole.ROLE_CUSTOMER,
                    true, false, true
            );
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userPrincipal, null, userPrincipal.getAuthorities()
            );

            String token = jwtTokenProvider.generateAccessToken(authentication);

            assertThat(token).isNotBlank();
            assertThat(jwtTokenProvider.validateToken(token)).isTrue();
            assertThat(jwtTokenProvider.getUserIdFromToken(token)).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should generate access token from user details")
        void shouldGenerateAccessTokenFromUserId() {
            String token = jwtTokenProvider.generateAccessTokenFromUserId(
                    1L, "test@example.com", "ROLE_CUSTOMER"
            );

            assertThat(token).isNotBlank();
            assertThat(jwtTokenProvider.validateToken(token)).isTrue();
            assertThat(jwtTokenProvider.getUserIdFromToken(token)).isEqualTo(1L);
            assertThat(jwtTokenProvider.getRoleFromToken(token)).isEqualTo("ROLE_CUSTOMER");
        }
    }

    @Nested
    @DisplayName("Refresh Token Tests")
    class RefreshTokenTests {

        @Test
        @DisplayName("Should generate refresh token")
        void shouldGenerateRefreshToken() {
            String token = jwtTokenProvider.generateRefreshToken(1L);

            assertThat(token).isNotBlank();
            assertThat(jwtTokenProvider.validateToken(token)).isTrue();
            assertThat(jwtTokenProvider.isRefreshToken(token)).isTrue();
        }

        @Test
        @DisplayName("Should identify access token is not refresh token")
        void shouldIdentifyAccessToken() {
            String accessToken = jwtTokenProvider.generateAccessTokenFromUserId(
                    1L, "test@example.com", "ROLE_CUSTOMER"
            );

            assertThat(jwtTokenProvider.isRefreshToken(accessToken)).isFalse();
        }
    }

    @Nested
    @DisplayName("Token Validation Tests")
    class TokenValidationTests {

        @Test
        @DisplayName("Should validate a valid token")
        void shouldValidateValidToken() {
            String token = jwtTokenProvider.generateAccessTokenFromUserId(
                    1L, "test@example.com", "ROLE_CUSTOMER"
            );

            assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        }

        @Test
        @DisplayName("Should invalidate a malformed token")
        void shouldInvalidateMalformedToken() {
            assertThat(jwtTokenProvider.validateToken("invalid-token")).isFalse();
        }

        @Test
        @DisplayName("Should invalidate an empty token")
        void shouldInvalidateEmptyToken() {
            assertThat(jwtTokenProvider.validateToken("")).isFalse();
        }
    }

    @Nested
    @DisplayName("Token Parsing Tests")
    class TokenParsingTests {

        @Test
        @DisplayName("Should extract user ID from token")
        void shouldExtractUserId() {
            String token = jwtTokenProvider.generateAccessTokenFromUserId(
                    42L, "user@example.com", "ROLE_ADMIN"
            );

            assertThat(jwtTokenProvider.getUserIdFromToken(token)).isEqualTo(42L);
        }

        @Test
        @DisplayName("Should extract role from token")
        void shouldExtractRole() {
            String token = jwtTokenProvider.generateAccessTokenFromUserId(
                    1L, "admin@example.com", "ROLE_ADMIN"
            );

            assertThat(jwtTokenProvider.getRoleFromToken(token)).isEqualTo("ROLE_ADMIN");
        }
    }

    @Nested
    @DisplayName("Expiration Tests")
    class ExpirationTests {

        @Test
        @DisplayName("Should return configured expiration times")
        void shouldReturnExpirationTimes() {
            assertThat(jwtTokenProvider.getAccessTokenExpiration()).isEqualTo(ACCESS_TOKEN_EXPIRATION);
            assertThat(jwtTokenProvider.getRefreshTokenExpiration()).isEqualTo(REFRESH_TOKEN_EXPIRATION);
        }
    }
}
