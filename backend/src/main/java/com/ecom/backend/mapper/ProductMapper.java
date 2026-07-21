package com.ecom.backend.mapper;

import com.ecom.backend.dto.request.ProductRequest;
import com.ecom.backend.dto.response.ProductResponse;
import com.ecom.backend.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) return null;
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .shortDescription(product.getShortDescription())
                .sku(product.getSku())
                .barcode(product.getBarcode())
                .hsnCode(product.getHsnCode())
                .gstRate(product.getGstRate())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .brandSlug(product.getBrand() != null ? product.getBrand().getSlug() : null)
                .basePrice(product.getBasePrice())
                .sellingPrice(product.getSellingPrice())
                .discountPercentage(product.getDiscountPercentage())
                .maxQuantity(product.getMaxQuantity())
                .minQuantity(product.getMinQuantity())
                .isFeatured(product.getIsFeatured())
                .isTrending(product.getIsTrending())
                .isNewArrival(product.getIsNewArrival())
                .isBestSeller(product.getIsBestSeller())
                .isActive(product.getIsActive())
                .totalStock(product.getTotalStock())
                .reservedStock(product.getReservedStock())
                .availableStock(product.getAvailableStock())
                .lowStockThreshold(product.getLowStockThreshold())
                .isLowStock(product.getAvailableStock() != null && product.getLowStockThreshold() != null
                        && product.getAvailableStock() <= product.getLowStockThreshold())
                .weight(product.getWeight())
                .weightUnit(product.getWeightUnit())
                .lengthCm(product.getLengthCm())
                .widthCm(product.getWidthCm())
                .heightCm(product.getHeightCm())
                .metaTitle(product.getMetaTitle())
                .metaDescription(product.getMetaDescription())
                .metaKeywords(product.getMetaKeywords())
                .averageRating(product.getAverageRating())
                .ratingCount(product.getRatingCount())
                .totalSold(product.getTotalSold())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .images(toImageResponses(product.getImages()))
                .variants(toVariantResponses(product.getVariants()))
                .specifications(toSpecificationResponses(product.getSpecifications()))
                .tags(product.getTags() != null ? product.getTags().stream().map(ProductTag::getName).collect(Collectors.toList()) : null)
                .build();
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        if (products == null) return Collections.emptyList();
        return products.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private List<ProductResponse.ProductImageResponse> toImageResponses(java.util.Set<ProductImage> images) {
        if (images == null) return Collections.emptyList();
        return images.stream().map(img -> ProductResponse.ProductImageResponse.builder()
                .id(img.getId())
                .imageUrl(img.getImageUrl())
                .altText(img.getAltText())
                .isPrimary(img.getIsPrimary())
                .displayOrder(img.getDisplayOrder())
                .build()).collect(Collectors.toList());
    }

    private List<ProductResponse.ProductVariantResponse> toVariantResponses(java.util.Set<ProductVariant> variants) {
        if (variants == null) return Collections.emptyList();
        return variants.stream().map(v -> ProductResponse.ProductVariantResponse.builder()
                .id(v.getId())
                .name(v.getVariantType())
                .value(v.getVariantValue())
                .priceAdjustment(v.getAdditionalPrice())
                .stock(v.getStock())
                .sku(v.getSku())
                .imageUrl(v.getImageUrl())
                .isActive(v.getIsActive())
                .build()).collect(Collectors.toList());
    }

    private List<ProductResponse.ProductSpecificationResponse> toSpecificationResponses(java.util.Set<ProductSpecification> specs) {
        if (specs == null) return Collections.emptyList();
        return specs.stream().map(s -> ProductResponse.ProductSpecificationResponse.builder()
                .id(s.getId())
                .name(s.getSpecKey())
                .value(s.getSpecValue())
                .displayOrder(s.getDisplayOrder())
                .build()).collect(Collectors.toList());
    }
}
