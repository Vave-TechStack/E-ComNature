package com.ecom.backend.service;

import com.ecom.backend.dto.request.CategoryRequest;
import com.ecom.backend.dto.response.CategoryResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.entity.Category;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.mapper.CategoryMapper;
import com.ecom.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Category with slug '" + request.getSlug() + "' already exists");
        }

        Category category = new Category();
        updateCategoryFromRequest(category, request);

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with id: " + request.getParentId()));
            category.setParent(parent);
            category.setLevel(parent.getLevel() != null ? parent.getLevel() + 1 : 1);
        } else {
            category.setLevel(0);
        }

        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        updateCategoryFromRequest(category, request);

        if (request.getParentId() != null && !request.getParentId().equals(category.getParent() != null ? category.getParent().getId() : null)) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParent(parent);
            category.setLevel(parent.getLevel() + 1);
        }

        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    private void updateCategoryFromRequest(Category category, CategoryRequest request) {
        if (request.getName() != null) category.setName(request.getName());
        if (request.getSlug() != null) category.setSlug(request.getSlug());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getImage() != null) category.setImage(request.getImage());
        if (request.getIcon() != null) category.setIcon(request.getIcon());
        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsFeatured() != null) category.setIsFeatured(request.getIsFeatured());
        if (request.getMetaTitle() != null) category.setMetaTitle(request.getMetaTitle());
        if (request.getMetaDescription() != null) category.setMetaDescription(request.getMetaDescription());
        if (request.getMetaKeywords() != null) category.setMetaKeywords(request.getMetaKeywords());
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setIsActive(false);
        category.softDelete();
        categoryRepository.save(category);
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return categoryMapper.toResponse(category);
    }

    public List<CategoryResponse> getRootCategories() {
        List<Category> categories = categoryRepository.findByParentIsNullAndIsActiveTrueAndIsDeletedFalse();
        return categoryMapper.toResponseList(categories);
    }

    public List<CategoryResponse> getSubCategories(Long parentId) {
        List<Category> categories = categoryRepository.findByParentIdAndIsActiveTrueAndIsDeletedFalse(parentId);
        return categoryMapper.toResponseList(categories);
    }

    public List<CategoryResponse> getFeaturedCategories() {
        List<Category> categories = categoryRepository.findByIsFeaturedTrueAndIsActiveTrueAndIsDeletedFalse();
        return categoryMapper.toResponseList(categories);
    }

    public PagedResponse<CategoryResponse> getAllCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categoryPage = categoryRepository.findByIsActiveTrueAndIsDeletedFalse(pageable);
        return PagedResponse.<CategoryResponse>builder()
                .content(categoryMapper.toResponseList(categoryPage.getContent()))
                .page(categoryPage.getNumber())
                .size(categoryPage.getSize())
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .first(categoryPage.isFirst())
                .last(categoryPage.isLast())
                .build();
    }

    public PagedResponse<CategoryResponse> searchCategories(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categoryPage = categoryRepository.searchCategories(search, pageable);
        return PagedResponse.<CategoryResponse>builder()
                .content(categoryMapper.toResponseList(categoryPage.getContent()))
                .page(categoryPage.getNumber())
                .size(categoryPage.getSize())
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .first(categoryPage.isFirst())
                .last(categoryPage.isLast())
                .build();
    }
}
