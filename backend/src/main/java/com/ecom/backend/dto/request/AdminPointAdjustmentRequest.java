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
public class AdminPointAdjustmentRequest {

    @Min(value = 1, message = "Points must be at least 1")
    private int points;

    @NotBlank(message = "Adjustment type is required (ADD or DEDUCT)")
    private String adjustmentType;

    @NotBlank(message = "Reason is required")
    private String reason;
}
