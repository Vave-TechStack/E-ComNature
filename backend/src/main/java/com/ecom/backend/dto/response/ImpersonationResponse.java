package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImpersonationResponse {
    private String accessToken;
    private String tokenType;
    private long expiresIn;
    private UserDto user;
}
