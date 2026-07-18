package com.ecom.backend.repository;

import com.ecom.backend.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByIsDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    Page<AuditLog> findByActorIdAndIsDeletedFalseOrderByCreatedAtDesc(Long actorId, Pageable pageable);

    Page<AuditLog> findByTargetIdAndIsDeletedFalseOrderByCreatedAtDesc(Long targetId, Pageable pageable);

    Page<AuditLog> findByActionAndIsDeletedFalseOrderByCreatedAtDesc(String action, Pageable pageable);

    Page<AuditLog> findByResourceAndResourceIdAndIsDeletedFalseOrderByCreatedAtDesc(
            String resource, String resourceId, Pageable pageable);

    Page<AuditLog> findBySeverityAndIsDeletedFalseOrderByCreatedAtDesc(String severity, Pageable pageable);

    List<AuditLog> findByTargetIdAndActionAndIsDeletedFalseOrderByCreatedAtDesc(
            Long targetId, String action, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.isDeleted = false AND " +
           "(LOWER(a.actionLabel) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.actorEmail) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.actorName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.targetEmail) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.targetName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<AuditLog> searchAuditLogs(@Param("search") String search, Pageable pageable);

    long countByActionAndCreatedAtBetweenAndIsDeletedFalse(
            String action, LocalDateTime start, LocalDateTime end);

    long countByIsDeletedFalse();
}
