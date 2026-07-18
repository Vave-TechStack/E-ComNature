package com.ecom.backend.controller;

import com.ecom.backend.dto.request.ChangePasswordRequest;
import com.ecom.backend.dto.request.ProfileUpdateRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.UserDto;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.ProfileService;
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
class ProfileControllerTest {

    @Mock private ProfileService profileService;

    @InjectMocks private ProfileController profileController;

    private UserPrincipal userPrincipal;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        userPrincipal = new UserPrincipal(
                1L, "john@example.com", "9876543210",
                "password", "John", "Doe",
                com.ecom.backend.entity.enums.UserRole.ROLE_CUSTOMER,
                true, false, true
        );

        userDto = UserDto.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .displayName("John Doe")
                .role("ROLE_CUSTOMER")
                .build();
    }

    @Nested
    @DisplayName("Get Profile Endpoint")
    class GetProfileEndpoint {

        @Test
        @DisplayName("Should return user profile")
        void shouldGetProfile() {
            given(profileService.getProfile(1L)).willReturn(userDto);

            ResponseEntity<ApiResponse<UserDto>> response = profileController.getProfile(userPrincipal);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().isSuccess()).isTrue();
            assertThat(response.getBody().getData().getEmail()).isEqualTo("john@example.com");
        }
    }

    @Nested
    @DisplayName("Update Profile Endpoint")
    class UpdateProfileEndpoint {

        @Test
        @DisplayName("Should update profile")
        void shouldUpdateProfile() {
            ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                    .firstName("Jane")
                    .build();

            UserDto updatedDto = UserDto.builder()
                    .id(1L)
                    .firstName("Jane")
                    .lastName("Doe")
                    .email("john@example.com")
                    .build();

            given(profileService.updateProfile(eq(1L), any(ProfileUpdateRequest.class)))
                    .willReturn(updatedDto);

            ResponseEntity<ApiResponse<UserDto>> response = profileController.updateProfile(userPrincipal, request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getFirstName()).isEqualTo("Jane");
        }
    }

    @Nested
    @DisplayName("Change Password Endpoint")
    class ChangePasswordEndpoint {

        @Test
        @DisplayName("Should change password")
        void shouldChangePassword() {
            ChangePasswordRequest request = new ChangePasswordRequest();
            request.setCurrentPassword("old-password");
            request.setNewPassword("NewPassword@123");
            request.setConfirmPassword("NewPassword@123");

            ResponseEntity<ApiResponse<Void>> response = profileController.changePassword(userPrincipal, request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getMessage()).isEqualTo("Password changed successfully");
            verify(profileService).changePassword(1L, request);
        }
    }

    @Nested
    @DisplayName("Two-Factor Authentication Endpoint")
    class TwoFactorEndpoint {

        @Test
        @DisplayName("Should enable 2FA")
        void shouldEnable2FA() {
            ResponseEntity<ApiResponse<Void>> response = profileController.toggleTwoFactor(userPrincipal, true);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getMessage()).isEqualTo("Two-factor authentication enabled");
            verify(profileService).toggleTwoFactor(1L, true);
        }

        @Test
        @DisplayName("Should disable 2FA")
        void shouldDisable2FA() {
            ResponseEntity<ApiResponse<Void>> response = profileController.toggleTwoFactor(userPrincipal, false);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getMessage()).isEqualTo("Two-factor authentication disabled");
            verify(profileService).toggleTwoFactor(1L, false);
        }
    }

    @Nested
    @DisplayName("Delete Account Endpoint")
    class DeleteAccountEndpoint {

        @Test
        @DisplayName("Should delete account")
        void shouldDeleteAccount() {
            ResponseEntity<ApiResponse<Void>> response = profileController.deleteAccount(userPrincipal);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getMessage()).isEqualTo("Account deleted successfully");
            verify(profileService).deleteAccount(1L);
        }
    }
}
