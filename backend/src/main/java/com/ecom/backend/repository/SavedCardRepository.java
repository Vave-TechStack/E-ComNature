package com.ecom.backend.repository;

import com.ecom.backend.entity.SavedCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedCardRepository extends JpaRepository<SavedCard, Long> {

    List<SavedCard> findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(Long userId);

    Optional<SavedCard> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    long countByUserIdAndIsDeletedFalse(Long userId);

    @Modifying
    @Query("UPDATE SavedCard c SET c.isDefault = false WHERE c.user.id = :userId AND c.isDeleted = false")
    void clearDefaultCards(@Param("userId") Long userId);

    Optional<SavedCard> findByUserIdAndIsDefaultTrueAndIsDeletedFalse(Long userId);
}
