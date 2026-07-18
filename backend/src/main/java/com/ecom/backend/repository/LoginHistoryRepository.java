package com.ecom.backend.repository;

import com.ecom.backend.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    List<LoginHistory> findByUserIdOrderByLoginAtDesc(Long userId);
    List<LoginHistory> findByUserIdAndLoginAtAfterOrderByLoginAtDesc(Long userId, LocalDateTime since);
    long countByIsSuccessfulAndLoginAtAfter(boolean successful, LocalDateTime since);
}
