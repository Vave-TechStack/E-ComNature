package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String action;
    private String actionLabel;
    private String description;
    private String details;
    private String changes;

    // Actor info
    private Long actorId;
    private String actorEmail;
    private String actorName;
    private String actorRole;
    private String actorIp;

    // Target info
    private Long targetId;
    private String targetEmail;
    private String targetName;

    // Resource info
    private String resource;
    private String resourceId;

    private String severity;
    private Boolean isSuccess;
    private LocalDateTime createdAt;
}
