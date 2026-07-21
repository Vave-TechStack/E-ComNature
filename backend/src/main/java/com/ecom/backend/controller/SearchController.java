package com.ecom.backend.controller;

import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.dto.response.ProductResponse;
import com.ecom.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
@Tag(name = "Search", description = "Search API")
@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @Operation(summary = "Search", description = "Search")
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<ProductResponse> response = searchService.searchProducts(
                query, categoryId, brandId, minPrice, maxPrice, inStock, sortBy, sortOrder, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results", response));
    }

    @Operation(summary = "Get Suggestions", description = "Get Suggestions")
    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSuggestions(@RequestParam String query) {
        List<String> suggestions = searchService.getSuggestions(query);
        return ResponseEntity.ok(ApiResponse.success("Suggestions", suggestions));
    }
}
