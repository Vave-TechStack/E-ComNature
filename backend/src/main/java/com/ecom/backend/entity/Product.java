package com.ecom.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_slug", columnList = "slug", unique = true),
    @Index(name = "idx_product_sku", columnList = "sku"),
    @Index(name = "idx_product_category", columnList = "category_id"),
    @Index(name = "idx_product_brand", columnList = "brand_id"),
    @Index(name = "idx_product_active", columnList = "is_active"),
    @Index(name = "idx_product_featured", columnList = "is_featured"),
    @Index(name = "idx_product_price", columnList = "selling_price"),
    @Index(name = "idx_product_created", columnList = "created_at")
})
public class Product extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "slug", unique = true, nullable = false, length = 255)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "sku", unique = true, length = 100)
    private String sku;

    @Column(name = "barcode", length = 100)
    private String barcode;

    @Column(name = "hsn_code", length = 20)
    private String hsnCode;

    @Column(name = "gst_rate")
    private Double gstRate = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "base_price", nullable = false)
    private Double basePrice;

    @Column(name = "selling_price", nullable = false)
    private Double sellingPrice;

    @Column(name = "discount_percentage")
    private Double discountPercentage = 0.0;

    @Column(name = "max_quantity")
    private Integer maxQuantity = 10;

    @Column(name = "min_quantity")
    private Integer minQuantity = 1;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_trending")
    private Boolean isTrending = false;

    @Column(name = "is_new_arrival")
    private Boolean isNewArrival = false;

    @Column(name = "is_best_seller")
    private Boolean isBestSeller = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "total_stock")
    private Integer totalStock = 0;

    @Column(name = "reserved_stock")
    private Integer reservedStock = 0;

    @Column(name = "available_stock")
    private Integer availableStock = 0;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 5;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "weight_unit", length = 10)
    private String weightUnit;

    @Column(name = "length_cm")
    private Double lengthCm;

    @Column(name = "width_cm")
    private Double widthCm;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "meta_title", length = 200)
    private String metaTitle;

    @Column(name = "meta_description", length = 500)
    private String metaDescription;

    @Column(name = "meta_keywords", length = 500)
    private String metaKeywords;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "total_sold")
    private Integer totalSold = 0;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("displayOrder ASC")
    private Set<ProductImage> images = new HashSet<>();

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductVariant> variants = new HashSet<>();

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductSpecification> specifications = new HashSet<>();

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private Set<ProductReview> reviews = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "product_tags",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<ProductTag> tags = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "product_related", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "related_product_id")
    private Set<Long> relatedProductIds = new HashSet<>();
}
