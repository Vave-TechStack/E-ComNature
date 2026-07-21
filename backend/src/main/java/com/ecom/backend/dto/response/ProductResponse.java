package com.ecom.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String shortDescription;
    private String sku;
    private String barcode;
    private String hsnCode;
    private Double gstRate;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private Long brandId;
    private String brandName;
    private String brandSlug;
    private Double basePrice;
    private Double sellingPrice;
    private Double discountPercentage;
    private Integer maxQuantity;
    private Integer minQuantity;
    private Boolean isFeatured;
    private Boolean isTrending;
    private Boolean isNewArrival;
    private Boolean isBestSeller;
    private Boolean isActive;
    private Integer totalStock;
    private Integer reservedStock;
    private Integer availableStock;
    private Integer lowStockThreshold;
    private Boolean isLowStock;
    private Double weight;
    private String weightUnit;
    private Double lengthCm;
    private Double widthCm;
    private Double heightCm;
    private String metaTitle;
    private String metaDescription;
    private String metaKeywords;
    private Double averageRating;
    private Integer ratingCount;
    private Integer totalSold;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductImageResponse> images;
    private List<ProductVariantResponse> variants;
    private List<ProductSpecificationResponse> specifications;
    private Set<Long> relatedProductIds;
    private List<String> tags;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ProductImageResponse {
        private Long id;
        private String imageUrl;
        private String altText;
        private Boolean isPrimary;
        private Integer displayOrder;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ProductVariantResponse {
        private Long id;
        private String name;
        private String value;
        private Double priceAdjustment;
        private Double finalPrice;
        private Integer stock;
        private String sku;
        private String imageUrl;
        private Boolean isActive;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ProductSpecificationResponse {
        private Long id;
        private String name;
        private String value;
        private Integer displayOrder;
    }
}
