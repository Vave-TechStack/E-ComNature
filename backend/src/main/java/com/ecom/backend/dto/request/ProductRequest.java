package com.ecom.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Product slug is required")
    @Size(max = 255, message = "Product slug must not exceed 255 characters")
    private String slug;

    private String description;

    @Size(max = 500, message = "Short description must not exceed 500 characters")
    private String shortDescription;

    private String sku;

    private String barcode;

    private String hsnCode;

    private Double gstRate;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Long brandId;

    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private Double basePrice;

    @NotNull(message = "Selling price is required")
    @Positive(message = "Selling price must be positive")
    private Double sellingPrice;

    private Double discountPercentage;

    private Integer maxQuantity;

    private Integer minQuantity;

    private Boolean isFeatured;

    private Boolean isTrending;

    private Boolean isNewArrival;

    private Boolean isBestSeller;

    private Boolean isActive;

    @Min(value = 0, message = "Total stock must be non-negative")
    private Integer totalStock;

    @Min(value = 0, message = "Low stock threshold must be non-negative")
    private Integer lowStockThreshold;

    private Double weight;

    private String weightUnit;

    private Double lengthCm;

    private Double widthCm;

    private Double heightCm;

    private String metaTitle;

    private String metaDescription;

    private String metaKeywords;

    private List<String> imageUrls;

    private List<ProductVariantRequest> variants;

    private List<ProductSpecificationRequest> specifications;

    private Set<Long> tagIds;

    private Set<Long> relatedProductIds;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductVariantRequest {
        @NotBlank(message = "Variant name is required")
        private String name;

        private String value;

        @Positive(message = "Price adjustment must be positive")
        private Double priceAdjustment;

        @Min(value = 0, message = "Stock must be non-negative")
        private Integer stock;

        private String sku;

        private String imageUrl;

        private Boolean isActive;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductSpecificationRequest {
        @NotBlank(message = "Specification name is required")
        private String name;

        @NotBlank(message = "Specification value is required")
        private String value;

        private Integer displayOrder;
    }
}
