package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedCardResponse {
    private Long id;
    private String cardHolderName;
    private String lastFourDigits;
    private String cardBrand;
    private String cardType;
    private String expiryMonth;
    private String expiryYear;
    private Boolean isDefault;
}
