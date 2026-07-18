package com.ecom.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedCardRequest {

    @NotBlank(message = "Card token is required")
    private String cardToken;

    @NotBlank(message = "Last four digits are required")
    @Pattern(regexp = "^\\d{4}$", message = "Last four digits must be exactly 4 digits")
    private String lastFourDigits;

    @NotBlank(message = "Card brand is required")
    private String cardBrand;

    @NotBlank(message = "Card type is required")
    private String cardType;

    @NotBlank(message = "Card holder name is required")
    private String cardHolderName;

    @NotBlank(message = "Expiry month is required")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Invalid expiry month")
    private String expiryMonth;

    @NotBlank(message = "Expiry year is required")
    @Pattern(regexp = "^\\d{4}$", message = "Expiry year must be 4 digits")
    private String expiryYear;

    private Boolean isDefault;
}
