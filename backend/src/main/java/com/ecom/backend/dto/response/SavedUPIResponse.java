package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedUPIResponse {
    private Long id;
    private String upiId;
    private Boolean isDefault;
    private Boolean isVerified;
}
