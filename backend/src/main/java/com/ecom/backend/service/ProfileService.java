package com.ecom.backend.service;

import com.ecom.backend.dto.request.ChangePasswordRequest;
import com.ecom.backend.dto.request.ProfileUpdateRequest;
import com.ecom.backend.dto.response.UserDto;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getProfile(Long userId) {
        User user = findUserById(userId);
        return mapToUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = findUserById(userId);

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getPhone() != null) {
            if (!request.getPhone().equals(user.getPhone()) &&
                userRepository.existsByPhoneAndIsDeletedFalse(request.getPhone())) {
                throw new BadRequestException("Phone number already in use");
            }
            user.setPhone(request.getPhone());
            user.setIsPhoneVerified(false);
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }

        user = userRepository.save(user);
        log.info("Profile updated for user: {}", user.getEmail());
        return mapToUserDto(user);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = findUserById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }

    @Transactional
    public void toggleTwoFactor(Long userId, boolean enabled) {
        User user = findUserById(userId);
        user.setTwoFactorEnabled(enabled);
        userRepository.save(user);
        log.info("2FA {} for user: {}", enabled ? "enabled" : "disabled", user.getEmail());
    }

    @Transactional
    public void deleteAccount(Long userId) {
        User user = findUserById(userId);
        user.softDelete();
        userRepository.save(user);
        log.warn("Account deleted for user: {}", user.getEmail());
    }

    private User findUserById(Long userId) {
        return userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .displayName(user.getDisplayName())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .emailVerified(user.getIsEmailVerified() != null && user.getIsEmailVerified())
                .phoneVerified(user.getIsPhoneVerified() != null && user.getIsPhoneVerified())
                .rewardPoints(user.getRewardPoints() != null ? user.getRewardPoints() : 0)
                .walletBalance(user.getWalletBalance() != null ? user.getWalletBalance() : 0.0)
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }
}
