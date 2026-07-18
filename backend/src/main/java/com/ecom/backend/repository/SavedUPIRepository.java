package com.ecom.backend.repository;

import com.ecom.backend.entity.SavedUPI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedUPIRepository extends JpaRepository<SavedUPI, Long> {

    List<SavedUPI> findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(Long userId);

    Optional<SavedUPI> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    Optional<SavedUPI> findByUserIdAndUpiIdAndIsDeletedFalse(Long userId, String upiId);

    boolean existsByUserIdAndUpiIdAndIsDeletedFalse(Long userId, String upiId);

    @Modifying
    @Query("UPDATE SavedUPI u SET u.isDefault = false WHERE u.user.id = :userId AND u.isDeleted = false")
    void clearDefaultUPIs(@Param("userId") Long userId);
}
