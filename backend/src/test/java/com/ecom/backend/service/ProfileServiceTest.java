package com.ecom.backend.service;

import com.ecom.backend.dto.request.ChangePasswordRequest;
import com.ecom.backend.dto.request.ProfileUpdateRequest;
import com.ecom.backend.dto.response.UserDto;
import com.ecom.backend.entity.User;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private ProfileService profileService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@example.com");
        user.setPhone("9876543210");
        user.setPassword("encoded-password");
        user.setDisplayName("John Doe");
        user.setRole(UserRole.ROLE_CUSTOMER);
        user.setProfileImage("old-image.jpg");
        user.setRewardPoints(50);
        user.setWalletBalance(100.0);
        user.setIsEmailVerified(true);
        user.setIsPhoneVerified(true);
        user.setIsActive(true);
        user.setIsDeleted(false);
    }

    @Nested
    @DisplayName("Get Profile Tests")
    class GetProfileTests {

        @Test
        @DisplayName("Should return user profile")
        void shouldReturnProfile() {
            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));

            UserDto profile = profileService.getProfile(1L);

            assertThat(profile).isNotNull();
            assertThat(profile.getId()).isEqualTo(1L);
            assertThat(profile.getFirstName()).isEqualTo("John");
            assertThat(profile.getEmail()).isEqualTo("john@example.com");
            assertThat(profile.getRole()).isEqualTo("ROLE_CUSTOMER");
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            given(userRepository.findByIdAndIsDeletedFalse(99L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> profileService.getProfile(99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Update Profile Tests")
    class UpdateProfileTests {

        @Test
        @DisplayName("Should update profile successfully")
        void shouldUpdateProfile() {
            ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                    .firstName("Jane")
                    .lastName("Smith")
                    .displayName("Jane Smith")
                    .profileImage("new-image.jpg")
                    .gender("Female")
                    .dateOfBirth("1995-05-15")
                    .build();

            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(userRepository.save(any(User.class))).willAnswer(invocation -> invocation.getArgument(0));

            UserDto updated = profileService.updateProfile(1L, request);

            assertThat(updated.getFirstName()).isEqualTo("Jane");
            assertThat(updated.getLastName()).isEqualTo("Smith");
            assertThat(updated.getDisplayName()).isEqualTo("Jane Smith");
            assertThat(updated.getProfileImage()).isEqualTo("new-image.jpg");
        }

        @Test
        @DisplayName("Should update phone and reset verification")
        void shouldUpdatePhoneAndResetVerification() {
            ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                    .phone("8765432109")
                    .build();

            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(userRepository.existsByPhoneAndIsDeletedFalse("8765432109")).willReturn(false);
            given(userRepository.save(any(User.class))).willAnswer(invocation -> invocation.getArgument(0));

            UserDto updated = profileService.updateProfile(1L, request);

            assertThat(updated.getPhone()).isEqualTo("8765432109");
            assertThat(user.getIsPhoneVerified()).isFalse();
        }

        @Test
        @DisplayName("Should throw exception when phone already in use")
        void shouldThrowExceptionWhenPhoneInUse() {
            ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                    .phone("8765432109")
                    .build();

            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(userRepository.existsByPhoneAndIsDeletedFalse("8765432109")).willReturn(true);

            assertThatThrownBy(() -> profileService.updateProfile(1L, request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Phone number already in use");
        }
    }

    @Nested
    @DisplayName("Change Password Tests")
    class ChangePasswordTests {

        @Test
        @DisplayName("Should change password successfully")
        void shouldChangePassword() {
            ChangePasswordRequest request = new ChangePasswordRequest();
            request.setCurrentPassword("old-password");
            request.setNewPassword("NewPassword@123");
            request.setConfirmPassword("NewPassword@123");

            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(passwordEncoder.matches("old-password", "encoded-password")).willReturn(true);
            given(passwordEncoder.encode("NewPassword@123")).willReturn("new-encoded-password");

            profileService.changePassword(1L, request);

            verify(passwordEncoder).encode("NewPassword@123");
            verify(userRepository).save(user);
        }

        @Test
        @DisplayName("Should throw exception when current password is incorrect")
        void shouldThrowExceptionWhenCurrentPasswordIncorrect() {
            ChangePasswordRequest request = new ChangePasswordRequest();
            request.setCurrentPassword("wrong-password");
            request.setNewPassword("NewPassword@123");
            request.setConfirmPassword("NewPassword@123");

            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(passwordEncoder.matches("wrong-password", "encoded-password")).willReturn(false);

            assertThatThrownBy(() -> profileService.changePassword(1L, request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Current password is incorrect");
        }

        @Test
        @DisplayName("Should throw exception when passwords do not match")
        void shouldThrowExceptionWhenPasswordsDontMatch() {
            ChangePasswordRequest request = new ChangePasswordRequest();
            request.setCurrentPassword("old-password");
            request.setNewPassword("NewPassword@123");
            request.setConfirmPassword("DifferentPassword@123");

            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(passwordEncoder.matches("old-password", "encoded-password")).willReturn(true);

            assertThatThrownBy(() -> profileService.changePassword(1L, request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("do not match");
        }
    }

    @Nested
    @DisplayName("Two-Factor Authentication Tests")
    class TwoFactorTests {

        @Test
        @DisplayName("Should enable 2FA")
        void shouldEnable2FA() {
            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));

            profileService.toggleTwoFactor(1L, true);

            assertThat(user.getTwoFactorEnabled()).isTrue();
            verify(userRepository).save(user);
        }

        @Test
        @DisplayName("Should disable 2FA")
        void shouldDisable2FA() {
            user.setTwoFactorEnabled(true);
            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));

            profileService.toggleTwoFactor(1L, false);

            assertThat(user.getTwoFactorEnabled()).isFalse();
            verify(userRepository).save(user);
        }
    }

    @Nested
    @DisplayName("Delete Account Tests")
    class DeleteAccountTests {

        @Test
        @DisplayName("Should soft delete account")
        void shouldSoftDeleteAccount() {
            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));

            profileService.deleteAccount(1L);

            assertThat(user.getIsDeleted()).isTrue();
            assertThat(user.getIsActive()).isFalse();
            assertThat(user.getDeletedAt()).isNotNull();
            verify(userRepository).save(user);
        }
    }
}
