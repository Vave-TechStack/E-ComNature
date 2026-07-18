package com.ecom.backend.service;

import com.ecom.backend.dto.request.*;
import com.ecom.backend.dto.response.AuthResponse;
import com.ecom.backend.dto.response.UserDto;
import com.ecom.backend.entity.*;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.exception.*;
import com.ecom.backend.repository.*;
import com.ecom.backend.security.JwtTokenProvider;
import com.ecom.backend.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final OtpService otpService;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final long LOCKOUT_DURATION_MINUTES = 30;

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        // Validate unique email/phone
        if (request.getEmail() != null && userRepository.existsByEmailAndIsDeletedFalse(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        if (request.getPhone() != null && userRepository.existsByPhoneAndIsDeletedFalse(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already registered");
        }

        // Create user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getFirstName() + (request.getLastName() != null ? " " + request.getLastName() : ""));
        user.setRole(UserRole.ROLE_CUSTOMER);
        user.setReferralCode(generateReferralCode());

        // Handle referral
        if (request.getReferralCode() != null) {
            var referrerOpt = userRepository.findByReferralCodeAndIsDeletedFalse(request.getReferralCode());
            if (referrerOpt.isPresent()) {
                User referrer = referrerOpt.get();
                user.setReferredBy(request.getReferralCode());
                referrer.setRewardPoints(referrer.getRewardPoints() != null ? referrer.getRewardPoints() + 50 : 50);
                userRepository.save(referrer);
            }
        }

        user = userRepository.save(user);

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessTokenFromUserId(
                user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // Save refresh token
        saveRefreshToken(user, refreshToken, httpRequest);

        // Log login history
        logLoginHistory(user, httpRequest, true, "REGISTRATION");

        log.info("User registered successfully: {}", user.getEmail());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findByEmailAndIsDeletedFalse(request.getEmailOrPhone())
                .orElseGet(() -> userRepository.findByPhoneAndIsDeletedFalse(request.getEmailOrPhone())
                        .orElseThrow(() -> new BadCredentialsException("Invalid credentials")));

        // Check if account is locked
        if (Boolean.TRUE.equals(user.getIsAccountLocked())) {
            if (user.getLockoutEnd() != null && LocalDateTime.now().isBefore(user.getLockoutEnd())) {
                throw new LockedException("Account is temporarily locked. Try again later.");
            } else {
                user.setIsAccountLocked(false);
                user.setFailedLoginAttempts(0);
                user.setLockoutEnd(null);
                userRepository.save(user);
            }
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmailOrPhone(), request.getPassword()));

            // Reset failed attempts on successful login
            user.setFailedLoginAttempts(0);
            user.setLastLoginAt(LocalDateTime.now());
            user.setLastLoginIp(httpRequest.getRemoteAddr());
            userRepository.save(user);

            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

            saveRefreshToken(user, refreshToken, httpRequest);
            logLoginHistory(user, httpRequest, true, "PASSWORD");

            log.info("User logged in successfully: {}", user.getEmail());
            return buildAuthResponse(user, accessToken, refreshToken);

        } catch (BadCredentialsException e) {
            handleFailedLogin(user, httpRequest);
            throw new BadCredentialsException("Invalid email/phone or password");
        }
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request, HttpServletRequest httpRequest) {
        RefreshToken storedToken = refreshTokenRepository
                .findByTokenAndIsRevokedFalse(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired refresh token"));

        if (storedToken.isExpired()) {
            storedToken.setIsRevoked(true);
            storedToken.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(storedToken);
            throw new BadRequestException("Refresh token has expired. Please login again.");
        }

        User user = storedToken.getUser();

        // Revoke old token
        storedToken.setIsRevoked(true);
        storedToken.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(storedToken);

        // Generate new tokens
        String newAccessToken = jwtTokenProvider.generateAccessTokenFromUserId(
                user.getId(), user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        saveRefreshToken(user, newRefreshToken, httpRequest);

        log.info("Token refreshed for user: {}", user.getEmail());
        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByTokenAndIsRevokedFalse(refreshToken)
                .ifPresent(token -> {
                    token.setIsRevoked(true);
                    token.setRevokedAt(LocalDateTime.now());
                    refreshTokenRepository.save(token);
                    log.info("User logged out: {}", token.getUser().getEmail());
                });
    }

    @Transactional
    public void sendOtp(String phone) {
        User user = userRepository.findByPhoneAndIsDeletedFalse(phone)
                .orElse(null);
        if (user == null) {
            // Register new user with phone
            user = new User();
            user.setPhone(phone);
            user.setFirstName("User");
            user.setRole(UserRole.ROLE_CUSTOMER);
            user.setReferralCode(generateReferralCode());
            user = userRepository.save(user);
        }

        String otp = otpService.generateOtp(phone);
        otpService.sendOtpSms(phone, otp);
        log.info("OTP sent to phone: {}", phone);
    }

    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request, HttpServletRequest httpRequest) {
        if (!otpService.verifyOtp(request.getPhone(), request.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByPhoneAndIsDeletedFalse(request.getPhone())
                .orElseThrow(() -> new ResourceNotFoundException("User", "phone", request.getPhone()));

        user.setIsPhoneVerified(true);
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessTokenFromUserId(
                user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        saveRefreshToken(user, refreshToken, httpRequest);
        logLoginHistory(user, httpRequest, true, "OTP");

        otpService.clearOtp(request.getPhone());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmailAndIsDeletedFalse(request.getEmailOrPhone())
                .orElseGet(() -> userRepository.findByPhoneAndIsDeletedFalse(request.getEmailOrPhone())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "email/phone", request.getEmailOrPhone())));

        String resetToken = UUID.randomUUID().toString();
        // Save reset token to user or a password reset entity
        // Send email/SMS with reset link

        if (user.getEmail() != null) {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);
        } else {
            // Send SMS with reset token
        }
        log.info("Password reset requested for: {}", user.getEmail() != null ? user.getEmail() : user.getPhone());
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Verify reset token and update password
        // This would normally look up the token in a password_reset_tokens table
        log.info("Password reset completed");
    }

    private void saveRefreshToken(User user, String token, HttpServletRequest request) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(token);
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(
                jwtTokenProvider.getRefreshTokenExpiration() / 1000));
        refreshToken.setIpAddress(request.getRemoteAddr());
        refreshToken.setUserAgent(request.getHeader("User-Agent"));
        refreshToken.setDeviceInfo(request.getHeader("Device-Info"));
        refreshTokenRepository.save(refreshToken);
    }

    private void logLoginHistory(User user, HttpServletRequest request, boolean success, String method) {
        LoginHistory history = new LoginHistory();
        history.setUser(user);
        history.setLoginAt(LocalDateTime.now());
        history.setIpAddress(request.getRemoteAddr());
        history.setUserAgent(request.getHeader("User-Agent"));
        history.setDeviceInfo(request.getHeader("Device-Info"));
        history.setIsSuccessful(success);
        history.setAuthMethod(method);
        loginHistoryRepository.save(history);
    }

    private void handleFailedLogin(User user, HttpServletRequest request) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            user.setIsAccountLocked(true);
            user.setLockoutEnd(LocalDateTime.now().plusMinutes(LOCKOUT_DURATION_MINUTES));
            log.warn("Account locked due to multiple failed attempts: {}", user.getEmail());
        }
        userRepository.save(user);

        logLoginHistory(user, request, false, "PASSWORD");
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .displayName(user.getDisplayName())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .emailVerified(user.getIsEmailVerified())
                .phoneVerified(user.getIsPhoneVerified())
                .rewardPoints(user.getRewardPoints())
                .walletBalance(user.getWalletBalance())
                .build();

        return AuthResponse.builder()
                .userId(user.getId())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .user(userDto)
                .build();
    }

    private String generateReferralCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
