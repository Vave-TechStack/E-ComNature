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

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserDto>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserDto profile = profileService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProfileUpdateRequest request) {
        UserDto updated = profileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @PutMapping("/two-factor")
    public ResponseEntity<ApiResponse<Void>> toggleTwoFactor(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam boolean enabled) {
        profileService.toggleTwoFactor(principal.getId(), enabled);
        return ResponseEntity.ok(ApiResponse.success(
                enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@AuthenticationPrincipal UserPrincipal principal) {
        profileService.deleteAccount(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully"));
    }
}
