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

    Page<Product> findByIsActiveTrueAndIsDeletedFalse(Pageable pageable);

    Page<Product> findByCategoryIdAndIsActiveTrueAndIsDeletedFalse(Long categoryId, Pageable pageable);

    Page<Product> findByBrandIdAndIsActiveTrueAndIsDeletedFalse(Long brandId, Pageable pageable);

    List<Product> findByIsFeaturedTrueAndIsDeletedFalseAndIsActiveTrue();

    List<Product> findByIsFeaturedTrueAndIsActiveTrueAndIsDeletedFalse();

    List<Product> findByIsBestSellerTrueAndIsDeletedFalseAndIsActiveTrue();

    List<Product> findByIsBestSellerTrueAndIsActiveTrueAndIsDeletedFalse();

    List<Product> findByIsNewArrivalTrueAndIsDeletedFalseAndIsActiveTrue();

    List<Product> findByIsNewArrivalTrueAndIsActiveTrueAndIsDeletedFalse();

    List<Product> findByIsTrendingTrueAndIsDeletedFalseAndIsActiveTrue();

    List<Product> findByIsTrendingTrueAndIsActiveTrueAndIsDeletedFalse();

    List<Product> findByIsActiveTrueAndIsDeletedFalse();

    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND p.isActive = true " +
           "AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.slug) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%'))" +
           "OR LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND p.isActive = true " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:brandId IS NULL OR p.brand.id = :brandId) " +
           "AND (:minPrice IS NULL OR p.sellingPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.sellingPrice <= :maxPrice) " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.slug) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> filterProducts(@Param("categoryId") Long categoryId,
                                 @Param("brandId") Long brandId,
                                 @Param("minPrice") Double minPrice,
                                 @Param("maxPrice") Double maxPrice,
                                 @Param("search") String search,
                                 Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND p.isActive = true " +
           "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByNameContaining(@Param("query") String query, Pageable pageable);

    List<Product> findTop5ByNameContainingIgnoreCaseAndIsActiveTrueAndIsDeletedFalse(String name);

    long countByIsDeletedFalse();
}
