package com.ecom.backend.repository;

import com.ecom.backend.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    Page<ProductReview> findByProductIdAndIsApprovedTrueAndIsDeletedFalse(Long productId, Pageable pageable);

    List<ProductReview> findByProductIdAndIsApprovedTrueAndIsDeletedFalse(Long productId);

    Page<ProductReview> findByUserIdAndIsDeletedFalse(Long userId, Pageable pageable);

    List<ProductReview> findByProductIdAndUserIdAndIsDeletedFalse(Long productId, Long userId);

    @Query("SELECT AVG(pr.rating) FROM ProductReview pr WHERE pr.product.id = :productId AND pr.isApproved = true")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(pr) FROM ProductReview pr WHERE pr.product.id = :productId AND pr.isApproved = true")
    Long getReviewCountByProductId(@Param("productId") Long productId);

    @Query("SELECT pr.rating, COUNT(pr) FROM ProductReview pr WHERE pr.product.id = :productId " +
           "AND pr.isApproved = true GROUP BY pr.rating ORDER BY pr.rating")
    List<Object[]> getRatingDistribution(@Param("productId") Long productId);

    Page<ProductReview> findByIsApprovedFalseAndIsDeletedFalse(Pageable pageable);

    @Query("SELECT COUNT(pr) > 0 FROM ProductReview pr WHERE pr.product.id = :productId " +
           "AND pr.user.id = :userId AND pr.isDeleted = false")
    boolean hasUserReviewedProduct(@Param("productId") Long productId, @Param("userId") Long userId);
}
