package com.ecom.backend.mapper;

import com.ecom.backend.dto.response.ReviewResponse;
import com.ecom.backend.entity.ProductReview;
import com.ecom.backend.entity.ReviewImage;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(ProductReview review) {
        if (review == null) return null;
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct() != null ? review.getProduct().getId() : null)
                .productName(review.getProduct() != null ? review.getProduct().getName() : null)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .userName(review.getUser() != null ? review.getUser().getFullName() : null)
                .userImage(review.getUser() != null ? review.getUser().getProfileImage() : null)
                .rating(review.getRating())
                .title(review.getTitle())
                .review(review.getReview())
                .isVerifiedPurchase(review.getIsVerifiedPurchase())
                .isApproved(review.getIsApproved())
                .helpfulCount(review.getHelpfulCount())
                .imageUrls(review.getImages() != null
                        ? review.getImages().stream().map(ReviewImage::getImageUrl).collect(Collectors.toList())
                        : Collections.emptyList())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public List<ReviewResponse> toResponseList(List<ProductReview> reviews) {
        if (reviews == null) return Collections.emptyList();
        return reviews.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
