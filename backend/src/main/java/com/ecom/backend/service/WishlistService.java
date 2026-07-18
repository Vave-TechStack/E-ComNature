package com.ecom.backend.service;

import com.ecom.backend.dto.request.WishlistRequest;
import com.ecom.backend.dto.response.WishlistItemResponse;
import com.ecom.backend.entity.Product;
import com.ecom.backend.entity.ProductVariant;
import com.ecom.backend.entity.User;
import com.ecom.backend.entity.WishlistItem;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.ProductRepository;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getUserWishlist(Long userId) {
        List<WishlistItem> items = wishlistItemRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId);
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistItemResponse addToWishlist(Long userId, WishlistRequest request) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findByIdAndIsDeletedFalse(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        // Check if already in wishlist
        if (wishlistItemRepository.existsByUserIdAndProductIdAndIsDeletedFalse(userId, product.getId())) {
            throw new BadRequestException("Product already in wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        item.setNotes(request.getNotes());

        if (request.getVariantId() != null) {
            // Validate variant belongs to product
            Set<ProductVariant> variants = product.getVariants();
            boolean variantExists = variants.stream()
                    .anyMatch(v -> v.getId().equals(request.getVariantId()));
            if (variantExists) {
                ProductVariant variant = variants.stream()
                        .filter(v -> v.getId().equals(request.getVariantId()))
                        .findFirst().orElse(null);
                item.setVariant(variant);
            }
        }

        item = wishlistItemRepository.save(item);
        log.info("Product added to wishlist: user={}, product={}", userId, product.getId());
        return mapToResponse(item);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long itemId) {
        WishlistItem item = wishlistItemRepository.findByIdAndUserIdAndIsDeletedFalse(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("WishlistItem", "id", itemId));
        item.softDelete();
        wishlistItemRepository.save(item);
        log.info("Product removed from wishlist: user={}, item={}", userId, itemId);
    }

    @Transactional
    public void removeByProduct(Long userId, Long productId) {
        wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
        log.info("Product removed from wishlist: user={}, product={}", userId, productId);
    }

    @Transactional
    public void clearWishlist(Long userId) {
        List<WishlistItem> items = wishlistItemRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId);
        items.forEach(WishlistItem::softDelete);
        wishlistItemRepository.saveAll(items);
        log.info("Wishlist cleared for user: {}", userId);
    }

    @Transactional
    public WishlistItemResponse moveToCart(Long userId, Long itemId) {
        // Soft delete from wishlist, cart addition handled by CartService
        WishlistItem item = wishlistItemRepository.findByIdAndUserIdAndIsDeletedFalse(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("WishlistItem", "id", itemId));
        item.softDelete();
        wishlistItemRepository.save(item);

        // Return the product info for cart service to use
        log.info("Item moved to cart from wishlist: user={}, item={}", userId, itemId);
        return mapToResponse(item);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistItemRepository.existsByUserIdAndProductIdAndIsDeletedFalse(userId, productId);
    }

    public Set<Long> getWishlistProductIds(Long userId) {
        return wishlistItemRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(item -> item.getProduct().getId())
                .collect(Collectors.toSet());
    }

    public long getWishlistCount(Long userId) {
        return wishlistItemRepository.countByUserIdAndIsDeletedFalse(userId);
    }

    private WishlistItemResponse mapToResponse(WishlistItem item) {
        Product product = item.getProduct();
        Double price = product.getSellingPrice();
        Double originalPrice = product.getBasePrice();
        Double discount = product.getDiscountPercentage();

        String imageUrl = product.getImages().stream()
                .findFirst()
                .map(img -> img.getImageUrl())
                .orElse(null);

        String variantName = null;
        if (item.getVariant() != null) {
            ProductVariant variant = item.getVariant();
            variantName = variant.getVariantValue() != null ? variant.getVariantValue()
                    : (variant.getColor() != null ? variant.getColor()
                    : (variant.getSize() != null ? variant.getSize() : null));
        }

        return WishlistItemResponse.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productSlug(product.getSlug())
                .productImage(imageUrl)
                .brand(product.getBrand() != null ? product.getBrand().getName() : null)
                .price(price)
                .originalPrice(originalPrice)
                .discount(discount)
                .rating(product.getAverageRating())
                .reviewCount(product.getRatingCount())
                .inStock(product.getAvailableStock() > 0)
                .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                .variantName(variantName)
                .notes(item.getNotes())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
