package com.ecom.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;
    private Long variantId;
    @NotNull(message = "Quantity is required")
    private Integer quantity;
    @NotBlank(message = "Movement type is required")
    private String movementType;
    private String notes;
    private String location;
}
