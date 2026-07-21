package com.ecom.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandRequest {
    @NotBlank(message = "Brand name is required")
    @Size(max = 100, message = "Brand name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Brand slug is required")
    @Size(max = 100, message = "Brand slug must not exceed 100 characters")
    private String slug;

    private String description;

    private String logo;

    private String coverImage;

    private Boolean isFeatured;

    private Integer displayOrder;

    private String metaTitle;

    private String metaDescription;
}
