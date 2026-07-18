package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String displayName;
    private String profileImage;
    private String role;
    private boolean emailVerified;
    private boolean phoneVerified;
    private int rewardPoints;
    private double walletBalance;
    private String gender;
    private String dateOfBirth;
}
