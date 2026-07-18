package com.ecom.backend.repository;

import com.ecom.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    Optional<WishlistItem> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    Optional<WishlistItem> findByUserIdAndProductIdAndIsDeletedFalse(Long userId, Long productId);

    boolean existsByUserIdAndProductIdAndIsDeletedFalse(Long userId, Long productId);

    long countByUserIdAndIsDeletedFalse(Long userId);

    void deleteByUserIdAndProductId(Long userId, Long productId);
}
