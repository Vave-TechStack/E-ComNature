package com.ecom.backend.controller;

import com.ecom.backend.dto.request.ChangePasswordRequest;
import com.ecom.backend.dto.request.ProfileUpdateRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.UserDto;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "User Profile", description = "User Profile API")
@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "Get Profile", description = "Get Profile")
    @GetMapping
    public ResponseEntity<ApiResponse<UserDto>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserDto profile = profileService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @Operation(summary = "Update Profile", description = "Update Profile")
    @PutMapping
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProfileUpdateRequest request) {
        UserDto updated = profileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @Operation(summary = "Change Password", description = "Change Password")
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @Operation(summary = "Toggle Two Factor", description = "Toggle Two Factor")
    @PutMapping("/two-factor")
    public ResponseEntity<ApiResponse<Void>> toggleTwoFactor(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam boolean enabled) {
        profileService.toggleTwoFactor(principal.getId(), enabled);
        return ResponseEntity.ok(ApiResponse.success(
                enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled"));
    }

    @Operation(summary = "Delete Account", description = "Delete Account")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@AuthenticationPrincipal UserPrincipal principal) {
        profileService.deleteAccount(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully"));
    }
}
