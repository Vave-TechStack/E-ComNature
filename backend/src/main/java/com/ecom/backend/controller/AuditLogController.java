package com.ecom.backend.controller;

import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.AuditLogPageResponse;
import com.ecom.backend.dto.response.AuditLogResponse;
import com.ecom.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Audit Logs", description = "Audit Logs API")
@RestController
@RequestMapping("/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * GET /admin/audit-logs
     * List all audit logs with search, filter by action/severity/actor/target, and pagination.
     */
    @Operation(summary = "List Audit Logs", description = "List Audit Logs")
    @GetMapping
    public ResponseEntity<ApiResponse<AuditLogPageResponse>> listAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) Long actorId,
            @RequestParam(required = false) Long targetId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        AuditLogPageResponse response = auditLogService.listAuditLogs(
                search, action, severity, actorId, targetId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /admin/audit-logs/{logId}
     * Get a single audit log entry by ID.
     */
    @Operation(summary = "Get Audit Log", description = "Get Audit Log")
    @GetMapping("/{logId}")
    public ResponseEntity<ApiResponse<AuditLogResponse>> getAuditLog(@PathVariable Long logId) {
        AuditLogResponse log = auditLogService.getAuditLog(logId);
        return ResponseEntity.ok(ApiResponse.success(log));
    }

    /**
     * GET /admin/audit-logs/by-target/{targetId}
     * Get audit logs for a specific target (e.g., customer).
     */
    @Operation(summary = "Get Audit Logs For Target", description = "Get Audit Logs For Target")
    @GetMapping("/by-target/{targetId}")
    public ResponseEntity<ApiResponse<java.util.List<AuditLogResponse>>> getAuditLogsForTarget(
            @PathVariable Long targetId,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(
                auditLogService.getAuditLogsForTarget(targetId, action, limit)));
    }
}
