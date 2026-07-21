package com.ecom.backend.mapper;

import com.ecom.backend.dto.response.BrandResponse;
import com.ecom.backend.entity.Brand;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BrandMapper {

    public BrandResponse toResponse(Brand brand) {
        if (brand == null) return null;
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .description(brand.getDescription())
                .logo(brand.getLogo())
                .coverImage(brand.getCoverImage())
                .isFeatured(brand.getIsFeatured())
                .displayOrder(brand.getDisplayOrder())
                .productCount(brand.getProductCount() != null ? Long.valueOf(brand.getProductCount()) : null)
                .metaTitle(brand.getMetaTitle())
                .metaDescription(brand.getMetaDescription())
                .createdAt(brand.getCreatedAt())
                .updatedAt(brand.getUpdatedAt())
                .build();
    }

    public List<BrandResponse> toResponseList(List<Brand> brands) {
        if (brands == null) return Collections.emptyList();
        return brands.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
