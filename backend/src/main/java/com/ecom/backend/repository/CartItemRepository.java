package com.ecom.backend.repository;

import com.ecom.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCartId(Long cartId);

    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    Optional<CartItem> findByCartIdAndProductIdAndVariantId(Long cartId, Long productId, Long variantId);

    @Query("SELECT SUM(ci.quantity) FROM CartItem ci WHERE ci.product.id = :productId")
    Integer getTotalQuantityByProductId(@Param("productId") Long productId);

    List<CartItem> findByCartIdAndIsSavedForLaterTrue(Long cartId);

    void deleteByCartId(Long cartId);

    long countByCartId(Long cartId);
}
