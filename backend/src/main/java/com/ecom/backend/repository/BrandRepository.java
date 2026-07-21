package com.ecom.backend.repository;

import com.ecom.backend.entity.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    Optional<Brand> findBySlug(String slug);

    Optional<Brand> findByName(String name);

    List<Brand> findByIsFeaturedTrueAndIsActiveTrueAndIsDeletedFalse();

    Page<Brand> findByIsActiveTrueAndIsDeletedFalse(Pageable pageable);

    @Query("SELECT b FROM Brand b WHERE b.isActive = true AND b.isDeleted = false " +
           "AND (LOWER(b.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Brand> searchBrands(@Param("search") String search, Pageable pageable);

    List<Brand> findByIsActiveTrueAndIsDeletedFalse();
}
