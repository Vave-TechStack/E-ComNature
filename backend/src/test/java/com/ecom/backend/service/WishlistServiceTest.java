package com.ecom.backend.service;

import com.ecom.backend.dto.request.WishlistRequest;
import com.ecom.backend.dto.response.WishlistItemResponse;
import com.ecom.backend.entity.*;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.ProductRepository;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.repository.WishlistItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock private WishlistItemRepository wishlistItemRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;

    @InjectMocks private WishlistService wishlistService;

    private User user;
    private Product product;
    private WishlistItem wishlistItem;
    private Brand brand;
    private Category category;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setEmail("john@example.com");
        user.setRole(UserRole.ROLE_CUSTOMER);

        brand = new Brand();
        brand.setId(1L);
        brand.setName("Test Brand");

        category = new Category();
        category.setId(1L);
        category.setName("Test Category");

        ProductImage image = new ProductImage();
        image.setId(1L);
        image.setImageUrl("https://example.com/image.jpg");
        image.setIsPrimary(true);

        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setSlug("test-product");
        product.setSellingPrice(499.0);
        product.setBasePrice(599.0);
        product.setDiscountPercentage(17.0);
        product.setAverageRating(4.5);
        product.setRatingCount(100);
        product.setAvailableStock(50);
        product.setBrand(brand);
        product.setCategory(category);
        product.setImages(Set.of(image));

        wishlistItem = new WishlistItem();
        wishlistItem.setId(1L);
        wishlistItem.setUser(user);
        wishlistItem.setProduct(product);
        wishlistItem.setNotes("Save for later");
    }

    @Nested
    @DisplayName("Get Wishlist Tests")
    class GetWishlistTests {

        @Test
        @DisplayName("Should return user wishlist")
        void shouldReturnWishlist() {
            given(wishlistItemRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(1L))
                    .willReturn(List.of(wishlistItem));

            List<WishlistItemResponse> items = wishlistService.getUserWishlist(1L);

            assertThat(items).hasSize(1);
            assertThat(items.get(0).getProductName()).isEqualTo("Test Product");
            assertThat(items.get(0).getProductSlug()).isEqualTo("test-product");
            assertThat(items.get(0).getPrice()).isEqualTo(499.0);
            assertThat(items.get(0).getInStock()).isTrue();
        }

        @Test
        @DisplayName("Should return empty wishlist")
        void shouldReturnEmptyWishlist() {
            given(wishlistItemRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(1L))
                    .willReturn(List.of());

            List<WishlistItemResponse> items = wishlistService.getUserWishlist(1L);

            assertThat(items).isEmpty();
        }
    }

    @Nested
    @DisplayName("Add to Wishlist Tests")
    class AddToWishlistTests {

        @Test
        @DisplayName("Should add product to wishlist")
        void shouldAddToWishlist() {
            WishlistRequest request = WishlistRequest.builder()
                    .productId(1L)
                    .notes("Want this!")
                    .build();

            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(productRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(product));
            given(wishlistItemRepository.existsByUserIdAndProductIdAndIsDeletedFalse(1L, 1L))
                    .willReturn(false);
            given(wishlistItemRepository.save(any(WishlistItem.class)))
                    .willAnswer(invocation -> {
                        WishlistItem item = invocation.getArgument(0);
                        item.setId(2L);
                        return item;
                    });

            WishlistItemResponse response = wishlistService.addToWishlist(1L, request);

            assertThat(response).isNotNull();
            assertThat(response.getProductId()).isEqualTo(1L);
            assertThat(response.getNotes()).isEqualTo("Want this!");
        }

        @Test
        @DisplayName("Should throw exception when product already in wishlist")
        void shouldThrowExceptionWhenAlreadyInWishlist() {
            WishlistRequest request = WishlistRequest.builder()
                    .productId(1L)
                    .build();

            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(productRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(product));
            given(wishlistItemRepository.existsByUserIdAndProductIdAndIsDeletedFalse(1L, 1L))
                    .willReturn(true);

            assertThatThrownBy(() -> wishlistService.addToWishlist(1L, request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already in wishlist");
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            WishlistRequest request = WishlistRequest.builder()
                    .productId(1L)
                    .build();

            given(userRepository.findByIdAndIsDeletedFalse(99L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> wishlistService.addToWishlist(99L, request))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Remove from Wishlist Tests")
    class RemoveFromWishlistTests {

        @Test
        @DisplayName("Should remove item from wishlist")
        void shouldRemoveFromWishlist() {
            given(wishlistItemRepository.findByIdAndUserIdAndIsDeletedFalse(1L, 1L))
                    .willReturn(Optional.of(wishlistItem));

            wishlistService.removeFromWishlist(1L, 1L);

            assertThat(wishlistItem.getIsDeleted()).isTrue();
            verify(wishlistItemRepository).save(wishlistItem);
        }

        @Test
        @DisplayName("Should throw exception when item not found")
        void shouldThrowExceptionWhenItemNotFound() {
            given(wishlistItemRepository.findByIdAndUserIdAndIsDeletedFalse(99L, 1L))
                    .willReturn(Optional.empty());

            assertThatThrownBy(() -> wishlistService.removeFromWishlist(1L, 99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Clear Wishlist Tests")
    class ClearWishlistTests {

        @Test
        @DisplayName("Should clear all items from wishlist")
        void shouldClearWishlist() {
            given(wishlistItemRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(1L))
                    .willReturn(Arrays.asList(wishlistItem, new WishlistItem()));

            wishlistService.clearWishlist(1L);

            verify(wishlistItemRepository).saveAll(anyList());
        }
    }

    @Nested
    @DisplayName("Check Wishlist Tests")
    class CheckWishlistTests {

        @Test
        @DisplayName("Should return true when product is in wishlist")
        void shouldReturnTrueWhenInWishlist() {
            given(wishlistItemRepository.existsByUserIdAndProductIdAndIsDeletedFalse(1L, 1L))
                    .willReturn(true);

            boolean result = wishlistService.isInWishlist(1L, 1L);

            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("Should return wishlist product IDs")
        void shouldReturnProductIds() {
            given(wishlistItemRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(1L))
                    .willReturn(List.of(wishlistItem));

            Set<Long> ids = wishlistService.getWishlistProductIds(1L);

            assertThat(ids).containsExactly(1L);
        }

        @Test
        @DisplayName("Should return wishlist count")
        void shouldReturnCount() {
            given(wishlistItemRepository.countByUserIdAndIsDeletedFalse(1L)).willReturn(3L);

            long count = wishlistService.getWishlistCount(1L);

            assertThat(count).isEqualTo(3L);
        }
    }

    @Nested
    @DisplayName("Move to Cart Tests")
    class MoveToCartTests {

        @Test
        @DisplayName("Should move item to cart")
        void shouldMoveToCart() {
            given(wishlistItemRepository.findByIdAndUserIdAndIsDeletedFalse(1L, 1L))
                    .willReturn(Optional.of(wishlistItem));
            given(wishlistItemRepository.save(any(WishlistItem.class)))
                    .willAnswer(invocation -> invocation.getArgument(0));

            WishlistItemResponse response = wishlistService.moveToCart(1L, 1L);

            assertThat(response).isNotNull();
            assertThat(response.getProductId()).isEqualTo(1L);
            assertThat(wishlistItem.getIsDeleted()).isTrue();
        }
    }
}
