package com.ecom.backend.service;

import com.ecom.backend.dto.request.ProductRequest;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.dto.response.ProductResponse;
import com.ecom.backend.entity.*;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.mapper.ProductMapper;
import com.ecom.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.findBySlugAndIsDeletedFalse(request.getSlug()).isPresent()) {
            throw new BadRequestException("Product with slug '" + request.getSlug() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        updateProductFromRequest(product, request);
        product.setCategory(category);
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));
            product.setBrand(brand);
        }

        // Set stock fields
        product.setTotalStock(request.getTotalStock() != null ? request.getTotalStock() : 0);
        product.setAvailableStock(request.getTotalStock() != null ? request.getTotalStock() : 0);
        product.setReservedStock(0);

        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));
            product.setBrand(brand);
        }

        updateProductFromRequest(product, request);
        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    private void updateProductFromRequest(Product product, ProductRequest request) {
        if (request.getName() != null) product.setName(request.getName());
        if (request.getSlug() != null) product.setSlug(request.getSlug());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getShortDescription() != null) product.setShortDescription(request.getShortDescription());
        if (request.getSku() != null) product.setSku(request.getSku());
        if (request.getBarcode() != null) product.setBarcode(request.getBarcode());
        if (request.getHsnCode() != null) product.setHsnCode(request.getHsnCode());
        if (request.getGstRate() != null) product.setGstRate(request.getGstRate());
        if (request.getBasePrice() != null) product.setBasePrice(request.getBasePrice());
        if (request.getSellingPrice() != null) product.setSellingPrice(request.getSellingPrice());
        if (request.getDiscountPercentage() != null) product.setDiscountPercentage(request.getDiscountPercentage());
        if (request.getMaxQuantity() != null) product.setMaxQuantity(request.getMaxQuantity());
        if (request.getMinQuantity() != null) product.setMinQuantity(request.getMinQuantity());
        if (request.getIsFeatured() != null) product.setIsFeatured(request.getIsFeatured());
        if (request.getIsTrending() != null) product.setIsTrending(request.getIsTrending());
        if (request.getIsNewArrival() != null) product.setIsNewArrival(request.getIsNewArrival());
        if (request.getIsBestSeller() != null) product.setIsBestSeller(request.getIsBestSeller());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());
        if (request.getLowStockThreshold() != null) product.setLowStockThreshold(request.getLowStockThreshold());
        if (request.getWeight() != null) product.setWeight(request.getWeight());
        if (request.getWeightUnit() != null) product.setWeightUnit(request.getWeightUnit());
        if (request.getLengthCm() != null) product.setLengthCm(request.getLengthCm());
        if (request.getWidthCm() != null) product.setWidthCm(request.getWidthCm());
        if (request.getHeightCm() != null) product.setHeightCm(request.getHeightCm());
        if (request.getMetaTitle() != null) product.setMetaTitle(request.getMetaTitle());
        if (request.getMetaDescription() != null) product.setMetaDescription(request.getMetaDescription());
        if (request.getMetaKeywords() != null) product.setMetaKeywords(request.getMetaKeywords());
        if (request.getRelatedProductIds() != null) product.setRelatedProductIds(request.getRelatedProductIds());
    }

    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setIsActive(false);
        product.softDelete();
        productRepository.save(product);
    }

    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toResponse(product);
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndIsDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return productMapper.toResponse(product);
    }

    public PagedResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findByIsActiveTrueAndIsDeletedFalse(pageable);
        return toPagedResponse(productPage);
    }

    public PagedResponse<ProductResponse> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findByCategoryIdAndIsActiveTrueAndIsDeletedFalse(categoryId, pageable);
        return toPagedResponse(productPage);
    }

    public PagedResponse<ProductResponse> getProductsByBrand(Long brandId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findByBrandIdAndIsActiveTrueAndIsDeletedFalse(brandId, pageable);
        return toPagedResponse(productPage);
    }

    public PagedResponse<ProductResponse> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.searchProducts(query, pageable);
        return toPagedResponse(productPage);
    }

    public List<ProductResponse> getFeaturedProducts() {
        List<Product> products = productRepository.findByIsFeaturedTrueAndIsActiveTrueAndIsDeletedFalse();
        return productMapper.toResponseList(products);
    }

    public List<ProductResponse> getTrendingProducts() {
        List<Product> products = productRepository.findByIsTrendingTrueAndIsActiveTrueAndIsDeletedFalse();
        return productMapper.toResponseList(products);
    }

    public List<ProductResponse> getNewArrivals() {
        List<Product> products = productRepository.findByIsNewArrivalTrueAndIsActiveTrueAndIsDeletedFalse();
        return productMapper.toResponseList(products);
    }

    public List<ProductResponse> getBestSellers() {
        List<Product> products = productRepository.findByIsBestSellerTrueAndIsActiveTrueAndIsDeletedFalse();
        return productMapper.toResponseList(products);
    }

    public PagedResponse<ProductResponse> filterProducts(Long categoryId, Long brandId, Double minPrice,
                                                          Double maxPrice, Boolean inStock, String search,
                                                          int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        // Use the product repository's filtering capability
        Page<Product> productPage = productRepository.filterProducts(categoryId, brandId, minPrice, maxPrice, search, pageable);
        return toPagedResponse(productPage);
    }

    private PagedResponse<ProductResponse> toPagedResponse(Page<Product> page) {
        return PagedResponse.<ProductResponse>builder()
                .content(productMapper.toResponseList(page.getContent()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
