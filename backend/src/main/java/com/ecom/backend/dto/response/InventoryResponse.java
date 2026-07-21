package com.ecom.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InventoryResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private String variantName;
    private String movementType;
    private Integer quantity;
    private Integer quantityBefore;
    private Integer quantityAfter;
    private String notes;
    private String adjustedBy;
    private LocalDateTime createdAt;
}
