package com.ecom.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "product_variants")
public class ProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku", unique = true, length = 100)
    private String sku;

    @Column(name = "barcode", length = 100)
    private String barcode;

    @Column(name = "variant_type", length = 50)
    private String variantType;

    @Column(name = "variant_value", length = 100)
    private String variantValue;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "color_code", length = 20)
    private String colorCode;

    @Column(name = "size", length = 50)
    private String size;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "weight_unit", length = 10)
    private String weightUnit;

    @Column(name = "additional_price")
    private Double additionalPrice = 0.0;

    @Column(name = "stock")
    private Integer stock = 0;

    @Column(name = "reserved_stock")
    private Integer reservedStock = 0;

    @Column(name = "available_stock")
    private Integer availableStock = 0;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
