package com.ecom.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "saved_upis")
public class SavedUPI extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "upi_id", nullable = false, length = 100)
    private String upiId;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Column(name = "is_verified")
    private Boolean isVerified = true;
}
