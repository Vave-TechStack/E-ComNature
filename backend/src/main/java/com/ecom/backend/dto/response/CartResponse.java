package com.ecom.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartResponse {
    private Long id;
    private Long userId;
    private String sessionId;
    private Double totalAmount;
    private Integer itemCount;
    private List<CartItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productSlug;
        private String productImage;
        private Long variantId;
        private String variantName;
        private Integer quantity;
        private Double unitPrice;
        private Double totalPrice;
        private Double discountPercentage;
        private Boolean isSavedForLater;
        private Boolean isGiftWrap;
        private String notes;
        private Boolean isAvailable;
    }
}
