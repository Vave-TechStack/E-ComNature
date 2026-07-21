package com.ecom.backend.mapper;

import com.ecom.backend.dto.response.CategoryResponse;
import com.ecom.backend.entity.Category;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        if (category == null) return null;
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .image(category.getImage())
                .icon(category.getIcon())
                .displayOrder(category.getDisplayOrder())
                .isFeatured(category.getIsFeatured())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .parentName(category.getParent() != null ? category.getParent().getName() : null)
                .level(category.getLevel())
                .productCount(category.getProductCount() != null ? Long.valueOf(category.getProductCount()) : null)
                .metaTitle(category.getMetaTitle())
                .metaDescription(category.getMetaDescription())
                .metaKeywords(category.getMetaKeywords())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .subCategories(toResponseList(category.getSubCategories()))
                .build();
    }

    public List<CategoryResponse> toResponseList(java.util.Set<Category> categories) {
        if (categories == null) return Collections.emptyList();
        return categories.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<CategoryResponse> toResponseList(List<Category> categories) {
        if (categories == null) return Collections.emptyList();
        return categories.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
