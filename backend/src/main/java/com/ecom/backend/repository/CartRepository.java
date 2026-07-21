package com.ecom.backend.repository;

import com.ecom.backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserId(Long userId);

    Optional<Cart> findBySessionId(String sessionId);

    Optional<Cart> findByUserIdOrSessionId(Long userId, String sessionId);

    void deleteByUserId(Long userId);
}
