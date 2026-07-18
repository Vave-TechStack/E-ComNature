package com.ecom.backend.repository;

import com.ecom.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByIdAndIsDeletedFalse(Long id);

    Optional<Product> findBySlugAndIsDeletedFalse(String slug);

    List<Product> findByCategoryIdAndIsDeletedFalseAndIsActiveTrue(Long categoryId);

    List<Product> findByIdInAndIsDeletedFalse(List<Long> ids);

    Page<Product> findByCategoryIdAndIsDeletedFalse(Long categoryId, Pageable pageable);

    Page<Product> findByBrandIdAndIsDeletedFalse(Long brandId, Pageable pageable);

    List<Product> findByIsFeaturedTrueAndIsDeletedFalseAndIsActiveTrue();

    List<Product> findByIsBestSellerTrueAndIsDeletedFalseAndIsActiveTrue();

    List<Product> findByIsNewArrivalTrueAndIsDeletedFalseAndIsActiveTrue();

    List<Product> findByIsTrendingTrueAndIsDeletedFalseAndIsActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND p.isActive = true " +
           "AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.slug) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(@Param("search") String search, Pageable pageable);

    long countByIsDeletedFalse();
}
