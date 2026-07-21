package com.ecom.backend.controller;

import com.ecom.backend.dto.request.ProductRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.dto.response.ProductResponse;
import com.ecom.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Products", description = "Products API")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Create Product", description = "Create Product")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", response));
    }

    @Operation(summary = "Update Product", description = "Update Product")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id,
                                                                       @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", response));
    }

    @Operation(summary = "Delete Product", description = "Delete Product")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @Operation(summary = "Get Product By Id", description = "Get Product By Id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product fetched successfully", response));
    }

    @Operation(summary = "Get Product By Slug", description = "Get Product By Slug")
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductBySlug(@PathVariable String slug) {
        ProductResponse response = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Product fetched successfully", response));
    }

    @Operation(summary = "Get All Products", description = "Get All Products")
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<ProductResponse> response = productService.getAllProducts(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Products fetched successfully", response));
    }

    @Operation(summary = "Get Products By Category", description = "Get Products By Category")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<ProductResponse> response = productService.getProductsByCategory(categoryId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Products fetched successfully", response));
    }

    @Operation(summary = "Get Products By Brand", description = "Get Products By Brand")
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getProductsByBrand(
            @PathVariable Long brandId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<ProductResponse> response = productService.getProductsByBrand(brandId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Products fetched successfully", response));
    }

    @Operation(summary = "Get Featured Products", description = "Get Featured Products")
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts() {
        List<ProductResponse> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.success("Featured products fetched", products));
    }

    @Operation(summary = "Get Trending Products", description = "Get Trending Products")
    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTrendingProducts() {
        List<ProductResponse> products = productService.getTrendingProducts();
        return ResponseEntity.ok(ApiResponse.success("Trending products fetched", products));
    }

    @Operation(summary = "Get New Arrivals", description = "Get New Arrivals")
    @GetMapping("/new-arrivals")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getNewArrivals() {
        List<ProductResponse> products = productService.getNewArrivals();
        return ResponseEntity.ok(ApiResponse.success("New arrivals fetched", products));
    }

    @Operation(summary = "Get Best Sellers", description = "Get Best Sellers")
    @GetMapping("/best-sellers")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getBestSellers() {
        List<ProductResponse> products = productService.getBestSellers();
        return ResponseEntity.ok(ApiResponse.success("Best sellers fetched", products));
    }

    @Operation(summary = "Search Products", description = "Search Products")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<ProductResponse> response = productService.searchProducts(query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results", response));
    }

    @Operation(summary = "Filter Products", description = "Filter Products")
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> filterProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<ProductResponse> response = productService.filterProducts(
                categoryId, brandId, minPrice, maxPrice, inStock, search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Filtered products", response));
    }
}
