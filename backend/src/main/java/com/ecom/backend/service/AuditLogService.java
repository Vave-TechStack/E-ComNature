package com.ecom.backend.service;

import com.ecom.backend.dto.response.AuditLogPageResponse;
import com.ecom.backend.dto.response.AuditLogResponse;
import com.ecom.backend.entity.AuditLog;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Record an audit log entry for any admin action.
     */
    @Transactional
    public AuditLogResponse recordAudit(AuditLogEntry entry) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(entry.action());
        auditLog.setActionLabel(entry.actionLabel());
        auditLog.setDescription(entry.description());
        auditLog.setDetails(entry.details());
        auditLog.setChanges(entry.changes());
        auditLog.setActorId(entry.actorId());
        auditLog.setActorEmail(entry.actorEmail());
        auditLog.setActorName(entry.actorName());
        auditLog.setActorRole(entry.actorRole());
        auditLog.setActorIp(entry.actorIp());
        auditLog.setTargetId(entry.targetId());
        auditLog.setTargetEmail(entry.targetEmail());
        auditLog.setTargetName(entry.targetName());
        auditLog.setResource(entry.resource());
        auditLog.setResourceId(entry.resourceId());
        auditLog.setSeverity(entry.severity() != null ? entry.severity() : "INFO");
        auditLog.setIsSuccess(entry.isSuccess() != null ? entry.isSuccess() : true);

        auditLog = auditLogRepository.save(auditLog);
        log.info("Audit log recorded: action={}, actor={}, target={}, severity={}",
                auditLog.getAction(), auditLog.getActorId(), auditLog.getTargetId(), auditLog.getSeverity());

        return mapToResponse(auditLog);
    }

    // ============ QUERY METHODS ============

    public AuditLogPageResponse listAuditLogs(String search, String action, String severity,
                                               Long actorId, Long targetId,
                                               int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<AuditLog> auditPage;

        if (search != null && !search.isBlank()) {
            auditPage = auditLogRepository.searchAuditLogs(search, pageable);
        } else if (action != null && !action.isBlank()) {
            auditPage = auditLogRepository.findByActionAndIsDeletedFalseOrderByCreatedAtDesc(action, pageable);
        } else if (severity != null && !severity.isBlank()) {
            auditPage = auditLogRepository.findBySeverityAndIsDeletedFalseOrderByCreatedAtDesc(severity, pageable);
        } else if (actorId != null) {
            auditPage = auditLogRepository.findByActorIdAndIsDeletedFalseOrderByCreatedAtDesc(actorId, pageable);
        } else if (targetId != null) {
            auditPage = auditLogRepository.findByTargetIdAndIsDeletedFalseOrderByCreatedAtDesc(targetId, pageable);
        } else {
            auditPage = auditLogRepository.findByIsDeletedFalseOrderByCreatedAtDesc(pageable);
        }

        List<AuditLogResponse> logs = auditPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return AuditLogPageResponse.builder()
                .logs(logs)
                .page(page)
                .size(size)
                .totalElements(auditPage.getTotalElements())
                .totalPages(auditPage.getTotalPages())
                .first(auditPage.isFirst())
                .last(auditPage.isLast())
                .build();
    }

    public AuditLogResponse getAuditLog(Long logId) {
        AuditLog auditLog = auditLogRepository.findById(logId)
                .orElseThrow(() -> new BadRequestException("Audit log not found with id: " + logId));
        return mapToResponse(auditLog);
    }

    public List<AuditLogResponse> getAuditLogsForTarget(Long targetId, String action, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return auditLogRepository.findByTargetIdAndActionAndIsDeletedFalseOrderByCreatedAtDesc(
                        targetId, action, pageable).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============ RECORD KEEPER (static inner class) ============

    /**
     * Immutable record representing an audit log entry.
     */
    public record AuditLogEntry(
            String action,
            String actionLabel,
            String description,
            String details,
            String changes,
            Long actorId,
            String actorEmail,
            String actorName,
            String actorRole,
            String actorIp,
            Long targetId,
            String targetEmail,
            String targetName,
            String resource,
            String resourceId,
            String severity,
            Boolean isSuccess
    ) {
        public static AuditLogEntryBuilder builder() {
            return new AuditLogEntryBuilder();
        }

        public static class AuditLogEntryBuilder {
            private String action;
            private String actionLabel;
            private String description;
            private String details;
            private String changes;
            private Long actorId;
            private String actorEmail;
            private String actorName;
            private String actorRole;
            private String actorIp;
            private Long targetId;
            private String targetEmail;
            private String targetName;
            private String resource;
            private String resourceId;
            private String severity;
            private Boolean isSuccess;

            public AuditLogEntryBuilder action(String action) { this.action = action; return this; }
            public AuditLogEntryBuilder actionLabel(String actionLabel) { this.actionLabel = actionLabel; return this; }
            public AuditLogEntryBuilder description(String description) { this.description = description; return this; }
            public AuditLogEntryBuilder details(String details) { this.details = details; return this; }
            public AuditLogEntryBuilder changes(String changes) { this.changes = changes; return this; }
            public AuditLogEntryBuilder actorId(Long actorId) { this.actorId = actorId; return this; }
            public AuditLogEntryBuilder actorEmail(String actorEmail) { this.actorEmail = actorEmail; return this; }
            public AuditLogEntryBuilder actorName(String actorName) { this.actorName = actorName; return this; }
            public AuditLogEntryBuilder actorRole(String actorRole) { this.actorRole = actorRole; return this; }
            public AuditLogEntryBuilder actorIp(String actorIp) { this.actorIp = actorIp; return this; }
            public AuditLogEntryBuilder targetId(Long targetId) { this.targetId = targetId; return this; }
            public AuditLogEntryBuilder targetEmail(String targetEmail) { this.targetEmail = targetEmail; return this; }
            public AuditLogEntryBuilder targetName(String targetName) { this.targetName = targetName; return this; }
            public AuditLogEntryBuilder resource(String resource) { this.resource = resource; return this; }
            public AuditLogEntryBuilder resourceId(String resourceId) { this.resourceId = resourceId; return this; }
            public AuditLogEntryBuilder severity(String severity) { this.severity = severity; return this; }
            public AuditLogEntryBuilder isSuccess(Boolean isSuccess) { this.isSuccess = isSuccess; return this; }

            public AuditLogEntry build() {
                return new AuditLogEntry(action, actionLabel, description, details, changes,
                        actorId, actorEmail, actorName, actorRole, actorIp,
                        targetId, targetEmail, targetName, resource, resourceId,
                        severity, isSuccess);
            }
        }
    }

    // ============ HELPER ============

    private AuditLogResponse mapToResponse(AuditLog auditLog) {
        return AuditLogResponse.builder()
                .id(auditLog.getId())
                .action(auditLog.getAction())
                .actionLabel(auditLog.getActionLabel())
                .description(auditLog.getDescription())
                .details(auditLog.getDetails())
                .changes(auditLog.getChanges())
                .actorId(auditLog.getActorId())
                .actorEmail(auditLog.getActorEmail())
                .actorName(auditLog.getActorName())
                .actorRole(auditLog.getActorRole())
                .actorIp(auditLog.getActorIp())
                .targetId(auditLog.getTargetId())
                .targetEmail(auditLog.getTargetEmail())
                .targetName(auditLog.getTargetName())
                .resource(auditLog.getResource())
                .resourceId(auditLog.getResourceId())
                .severity(auditLog.getSeverity())
                .isSuccess(auditLog.getIsSuccess())
                .createdAt(auditLog.getCreatedAt())
                .build();
    }
}
