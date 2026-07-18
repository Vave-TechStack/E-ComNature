package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSlug;
    private String productImage;
    private String brand;
    private Double price;
    private Double originalPrice;
    private Double discount;
    private Double rating;
    private Integer reviewCount;
    private Boolean inStock;
    private Long variantId;
    private String variantName;
    private String notes;
    private LocalDateTime createdAt;
}
