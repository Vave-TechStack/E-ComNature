package com.ecom.backend.service;

import com.ecom.backend.dto.request.CartRequest;
import com.ecom.backend.dto.response.CartResponse;
import com.ecom.backend.entity.*;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.mapper.CartMapper;
import com.ecom.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    public CartResponse getCart(Long userId, String sessionId) {
        Cart cart = findCart(userId, sessionId);
        return cartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(Long userId, String sessionId, CartRequest request) {
        Cart cart = findOrCreateCart(userId, sessionId);
        Product product = productRepository.findByIdAndIsDeletedFalse(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getIsActive()) {
            throw new BadRequestException("Product is not available");
        }

        Optional<CartItem> existingItem;
        if (request.getVariantId() != null) {
            existingItem = cartItemRepository.findByCartIdAndProductIdAndVariantId(cart.getId(), request.getProductId(), request.getVariantId());
        } else {
            existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), request.getProductId());
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1);
            if (product.getMaxQuantity() != null && newQty > product.getMaxQuantity()) {
                throw new BadRequestException("Cannot add more than " + product.getMaxQuantity() + " items");
            }
            item.setQuantity(newQty);
            item.setTotalPrice(item.getUnitPrice() * newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            if (request.getVariantId() != null) {
                // Would look up variant in real implementation
                item.setVariant(null);
            }
            item.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
            item.setUnitPrice(product.getSellingPrice());
            item.setTotalPrice(product.getSellingPrice() * (request.getQuantity() != null ? request.getQuantity() : 1));
            if (request.getIsSavedForLater() != null) item.setIsSavedForLater(request.getIsSavedForLater());
            if (request.getIsGiftWrap() != null) item.setIsGiftWrap(request.getIsGiftWrap());
            if (request.getNotes() != null) item.setNotes(request.getNotes());
            cart.getItems().add(item);
            cartItemRepository.save(item);
        }

        recalculateCart(cart);
        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateCartItem(Long userId, String sessionId, Long itemId, Integer quantity) {
        Cart cart = findCart(userId, sessionId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to this cart");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            Product product = item.getProduct();
            if (product.getMaxQuantity() != null && quantity > product.getMaxQuantity()) {
                throw new BadRequestException("Cannot add more than " + product.getMaxQuantity() + " items");
            }
            item.setQuantity(quantity);
            item.setTotalPrice(item.getUnitPrice() * quantity);
            cartItemRepository.save(item);
        }

        recalculateCart(cart);
        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeFromCart(Long userId, String sessionId, Long itemId) {
        Cart cart = findCart(userId, sessionId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to this cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        recalculateCart(cart);
        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(Long userId, String sessionId) {
        Cart cart = findCart(userId, sessionId);
        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
        cart.setTotalAmount(0.0);
        cart.setItemCount(0);
        cartRepository.save(cart);
    }

    private Cart findCart(Long userId, String sessionId) {
        if (userId != null) {
            return cartRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));
        } else if (sessionId != null) {
            return cartRepository.findBySessionId(sessionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found for session"));
        }
        throw new BadRequestException("Either userId or sessionId is required");
    }

    private Cart findOrCreateCart(Long userId, String sessionId) {
        if (userId != null) {
            return cartRepository.findByUserId(userId).orElseGet(() -> {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                Cart newCart = new Cart();
                newCart.setUser(user);
                newCart.setTotalAmount(0.0);
                newCart.setItemCount(0);
                return cartRepository.save(newCart);
            });
        } else if (sessionId != null) {
            return cartRepository.findBySessionId(sessionId).orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setSessionId(sessionId);
                newCart.setTotalAmount(0.0);
                newCart.setItemCount(0);
                return cartRepository.save(newCart);
            });
        }
        throw new BadRequestException("Either userId or sessionId is required");
    }

    private void recalculateCart(Cart cart) {
        double total = cart.getItems().stream()
                .filter(item -> !Boolean.TRUE.equals(item.getIsSavedForLater()))
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
        int count = (int) cart.getItems().stream()
                .filter(item -> !Boolean.TRUE.equals(item.getIsSavedForLater()))
                .count();
        cart.setTotalAmount(total);
        cart.setItemCount(count);
    }
}
