package com.ecom.backend.repository;

import com.ecom.backend.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    Page<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    List<StockMovement> findByProductIdAndReferenceTypeOrderByCreatedAtDesc(Long productId, String referenceType);

    List<StockMovement> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}
