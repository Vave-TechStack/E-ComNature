package com.ecom.backend.controller;

import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.AuditLogPageResponse;
import com.ecom.backend.dto.response.AuditLogResponse;
import com.ecom.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * GET /admin/audit-logs
     * List all audit logs with search, filter by action/severity/actor/target, and pagination.
     */
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
    @GetMapping("/{logId}")
    public ResponseEntity<ApiResponse<AuditLogResponse>> getAuditLog(@PathVariable Long logId) {
        AuditLogResponse log = auditLogService.getAuditLog(logId);
        return ResponseEntity.ok(ApiResponse.success(log));
    }

    /**
     * GET /admin/audit-logs/by-target/{targetId}
     * Get audit logs for a specific target (e.g., customer).
     */
    @GetMapping("/by-target/{targetId}")
    public ResponseEntity<ApiResponse<java.util.List<AuditLogResponse>>> getAuditLogsForTarget(
            @PathVariable Long targetId,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(
                auditLogService.getAuditLogsForTarget(targetId, action, limit)));
    }
}
