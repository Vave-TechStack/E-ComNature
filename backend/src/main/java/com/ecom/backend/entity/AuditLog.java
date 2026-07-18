package com.ecom.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_actor", columnList = "actorId"),
    @Index(name = "idx_audit_target", columnList = "targetId"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_resource", columnList = "resource,resourceId"),
    @Index(name = "idx_audit_created", columnList = "createdAt")
})
public class AuditLog extends BaseEntity {

    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @Column(name = "action_label", length = 200)
    private String actionLabel;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "changes", columnDefinition = "TEXT")
    private String changes;

    // Who performed the action
    @Column(name = "actor_id", nullable = false)
    private Long actorId;

    @Column(name = "actor_email", length = 100)
    private String actorEmail;

    @Column(name = "actor_name", length = 100)
    private String actorName;

    @Column(name = "actor_role", length = 50)
    private String actorRole;

    @Column(name = "actor_ip", length = 50)
    private String actorIp;

    // Who/what was affected
    @Column(name = "target_id")
    private Long targetId;

    @Column(name = "target_email", length = 100)
    private String targetEmail;

    @Column(name = "target_name", length = 100)
    private String targetName;

    // Resource info
    @Column(name = "resource", length = 50)
    private String resource;

    @Column(name = "resource_id", length = 100)
    private String resourceId;

    @Column(name = "severity", length = 20)
    private String severity = "INFO";

    @Column(name = "is_success")
    private Boolean isSuccess = true;
}
