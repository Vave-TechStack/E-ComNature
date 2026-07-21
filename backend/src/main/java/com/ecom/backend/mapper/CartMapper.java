package com.ecom.backend.mapper;

import com.ecom.backend.dto.response.CartResponse;
import com.ecom.backend.entity.Cart;
import com.ecom.backend.entity.CartItem;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartResponse toResponse(Cart cart) {
        if (cart == null) return null;
        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .sessionId(cart.getSessionId())
                .totalAmount(cart.getTotalAmount())
                .itemCount(cart.getItemCount())
                .items(toItemResponseList(cart.getItems()))
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    private List<CartResponse.CartItemResponse> toItemResponseList(java.util.Set<CartItem> items) {
        if (items == null) return Collections.emptyList();
        return items.stream()
            .map((CartItem item) -> CartResponse.CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProduct() != null ? item.getProduct().getName() : null)
                .productSlug(item.getProduct() != null ? item.getProduct().getSlug() : null)
                .productImage(item.getProduct() != null && !item.getProduct().getImages().isEmpty()
                        ? item.getProduct().getImages().iterator().next().getImageUrl() : null)
                .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                .variantName(item.getVariant() != null ? item.getVariant().getVariantValue() : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .discountPercentage(item.getProduct() != null ? item.getProduct().getDiscountPercentage() : 0.0)
                .isSavedForLater(item.getIsSavedForLater())
                .isGiftWrap(item.getIsGiftWrap())
                .notes(item.getNotes())
                .isAvailable(item.getProduct() != null && item.getProduct().getIsActive()
                        && item.getProduct().getAvailableStock() >= item.getQuantity())
                .build())
            .collect(Collectors.toList());
    }
}
