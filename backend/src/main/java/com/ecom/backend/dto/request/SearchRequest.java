package com.ecom.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequest {
    private String query;
    private Long categoryId;
    private Long brandId;
    private Double minPrice;
    private Double maxPrice;
    private List<String> attributes;
    private Boolean inStock;
    private Boolean isFeatured;
    private String sortBy;
    private String sortOrder;
    private int page = 0;
    private int size = 20;
}
