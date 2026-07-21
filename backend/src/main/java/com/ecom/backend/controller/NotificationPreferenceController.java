package com.ecom.backend.controller;

import com.ecom.backend.dto.request.NotificationPreferenceRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.NotificationPreferenceResponse;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.NotificationPreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Notifications", description = "Notifications API")
@RestController
@RequestMapping("/profile/notifications")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final NotificationPreferenceService notificationPreferenceService;

    @Operation(summary = "Get Preferences", description = "Get Preferences")
    @GetMapping
    public ResponseEntity<ApiResponse<NotificationPreferenceResponse>> getPreferences(
            @AuthenticationPrincipal UserPrincipal principal) {
        NotificationPreferenceResponse preferences = notificationPreferenceService
                .getPreferences(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(preferences));
    }

    @Operation(summary = "Update Preferences", description = "Update Preferences")
    @PutMapping
    public ResponseEntity<ApiResponse<NotificationPreferenceResponse>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody NotificationPreferenceRequest request) {
        NotificationPreferenceResponse updated = notificationPreferenceService
                .updatePreferences(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Preferences updated successfully", updated));
    }
}
