package com.ecom.backend.service;

import com.ecom.backend.dto.request.ReviewRequest;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.dto.response.ReviewResponse;
import com.ecom.backend.entity.Product;
import com.ecom.backend.entity.ProductReview;
import com.ecom.backend.entity.ReviewImage;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.mapper.ReviewMapper;
import com.ecom.backend.repository.OrderRepository;
import com.ecom.backend.repository.ProductRepository;
import com.ecom.backend.repository.ProductReviewRepository;
import com.ecom.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ReviewMapper reviewMapper;

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        Product product = productRepository.findByIdAndIsDeletedFalse(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (reviewRepository.hasUserReviewedProduct(request.getProductId(), userId)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        boolean isVerifiedPurchase = orderRepository.existsByUserIdAndOrderItemsProductId(userId, request.getProductId());

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setReview(request.getReview());
        review.setIsVerifiedPurchase(isVerifiedPurchase);
        review.setIsApproved(false);
        review.setHelpfulCount(0);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            review.setImages(request.getImageUrls().stream().map(url -> {
                ReviewImage img = new ReviewImage();
                img.setReview(review);
                img.setImageUrl(url);
                return img;
            }).collect(Collectors.toSet()));
        }

        ProductReview savedReview = reviewRepository.save(review);

        // Update product average rating
        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId());
        Long count = reviewRepository.getReviewCountByProductId(product.getId());
        product.setAverageRating(avgRating != null ? avgRating : 0.0);
        product.setRatingCount(count != null ? count.intValue() : 0);
        productRepository.save(product);

        return reviewMapper.toResponse(savedReview);
    }

    @Transactional
    public ReviewResponse approveReview(Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setIsApproved(true);
        review = reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.softDelete();
        reviewRepository.save(review);
    }

    public PagedResponse<ReviewResponse> getProductReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductReview> reviewPage = reviewRepository.findByProductIdAndIsApprovedTrueAndIsDeletedFalse(productId, pageable);
        return toPagedResponse(reviewPage);
    }

    public PagedResponse<ReviewResponse> getUserReviews(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductReview> reviewPage = reviewRepository.findByUserIdAndIsDeletedFalse(userId, pageable);
        return toPagedResponse(reviewPage);
    }

    public PagedResponse<ReviewResponse> getPendingReviews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductReview> reviewPage = reviewRepository.findByIsApprovedFalseAndIsDeletedFalse(pageable);
        return toPagedResponse(reviewPage);
    }

    private PagedResponse<ReviewResponse> toPagedResponse(Page<ProductReview> page) {
        return PagedResponse.<ReviewResponse>builder()
                .content(reviewMapper.toResponseList(page.getContent()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
