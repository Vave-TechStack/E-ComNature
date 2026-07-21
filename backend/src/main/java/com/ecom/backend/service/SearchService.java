package com.ecom.backend.service;

import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.dto.response.ProductResponse;
import com.ecom.backend.entity.Product;
import com.ecom.backend.mapper.ProductMapper;
import com.ecom.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public PagedResponse<ProductResponse> searchProducts(String query, Long categoryId, Long brandId,
                                                          Double minPrice, Double maxPrice, Boolean inStock,
                                                          String sortBy, String sortOrder, int page, int size) {
        if (sortBy == null || sortBy.isEmpty()) sortBy = "createdAt";
        if (sortOrder == null || sortOrder.isEmpty()) sortOrder = "desc";

        Sort sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage = productRepository.filterProducts(
                categoryId, brandId, minPrice, maxPrice, query, pageable);

        return PagedResponse.<ProductResponse>builder()
                .content(productMapper.toResponseList(productPage.getContent()))
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .first(productPage.isFirst())
                .last(productPage.isLast())
                .build();
    }

    public List<String> getSuggestions(String query) {
        // Return simple suggestions based on product names
        return productRepository.findTop5ByNameContainingIgnoreCaseAndIsActiveTrueAndIsDeletedFalse(query)
                .stream()
                .map(Product::getName)
                .toList();
    }
}
