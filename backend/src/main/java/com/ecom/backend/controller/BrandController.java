package com.ecom.backend.controller;

import com.ecom.backend.dto.request.BrandRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.BrandResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Brands", description = "Brands API")
@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @Operation(summary = "Create Brand", description = "Create Brand")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandResponse>> createBrand(@Valid @RequestBody BrandRequest request) {
        BrandResponse response = brandService.createBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Brand created successfully", response));
    }

    @Operation(summary = "Update Brand", description = "Update Brand")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandResponse>> updateBrand(@PathVariable Long id,
                                                                   @Valid @RequestBody BrandRequest request) {
        BrandResponse response = brandService.updateBrand(id, request);
        return ResponseEntity.ok(ApiResponse.success("Brand updated successfully", response));
    }

    @Operation(summary = "Delete Brand", description = "Delete Brand")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.success("Brand deleted successfully", null));
    }

    @Operation(summary = "Get Brand By Id", description = "Get Brand By Id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> getBrandById(@PathVariable Long id) {
        BrandResponse response = brandService.getBrandById(id);
        return ResponseEntity.ok(ApiResponse.success("Brand fetched successfully", response));
    }

    @Operation(summary = "Get All Brands", description = "Get All Brands")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAllBrands() {
        List<BrandResponse> brands = brandService.getAllBrands();
        return ResponseEntity.ok(ApiResponse.success("Brands fetched successfully", brands));
    }

    @Operation(summary = "Get Featured Brands", description = "Get Featured Brands")
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getFeaturedBrands() {
        List<BrandResponse> brands = brandService.getFeaturedBrands();
        return ResponseEntity.ok(ApiResponse.success("Featured brands fetched", brands));
    }

    @Operation(summary = "Search Brands", description = "Search Brands")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<BrandResponse>>> searchBrands(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<BrandResponse> response = brandService.searchBrands(query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results", response));
    }

    @Operation(summary = "Get Brands Paginated", description = "Get Brands Paginated")
    @GetMapping("/paginated")
    public ResponseEntity<ApiResponse<PagedResponse<BrandResponse>>> getBrandsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<BrandResponse> response = brandService.getBrands(page, size);
        return ResponseEntity.ok(ApiResponse.success("Brands fetched", response));
    }
}
