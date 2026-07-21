package com.ecom.backend.controller;

import com.ecom.backend.dto.request.CategoryRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.CategoryResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Categories", description = "Categories API")
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Create Category", description = "Create Category")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", response));
    }

    @Operation(summary = "Update Category", description = "Update Category")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@PathVariable Long id,
                                                                         @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", response));
    }

    @Operation(summary = "Delete Category", description = "Delete Category")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    @Operation(summary = "Get Category By Id", description = "Get Category By Id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category fetched successfully", response));
    }

    @Operation(summary = "Get Category By Slug", description = "Get Category By Slug")
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryBySlug(@PathVariable String slug) {
        CategoryResponse response = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Category fetched successfully", response));
    }

    @Operation(summary = "Get All Categories", description = "Get All Categories")
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CategoryResponse>>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<CategoryResponse> response = categoryService.getAllCategories(page, size);
        return ResponseEntity.ok(ApiResponse.success("Categories fetched successfully", response));
    }

    @Operation(summary = "Get Root Categories", description = "Get Root Categories")
    @GetMapping("/root")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getRootCategories() {
        List<CategoryResponse> categories = categoryService.getRootCategories();
        return ResponseEntity.ok(ApiResponse.success("Root categories fetched", categories));
    }

    @Operation(summary = "Get Sub Categories", description = "Get Sub Categories")
    @GetMapping("/{parentId}/subcategories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getSubCategories(@PathVariable Long parentId) {
        List<CategoryResponse> categories = categoryService.getSubCategories(parentId);
        return ResponseEntity.ok(ApiResponse.success("Subcategories fetched", categories));
    }

    @Operation(summary = "Get Featured Categories", description = "Get Featured Categories")
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getFeaturedCategories() {
        List<CategoryResponse> categories = categoryService.getFeaturedCategories();
        return ResponseEntity.ok(ApiResponse.success("Featured categories fetched", categories));
    }

    @Operation(summary = "Search Categories", description = "Search Categories")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<CategoryResponse>>> searchCategories(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<CategoryResponse> response = categoryService.searchCategories(query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results", response));
    }
}
