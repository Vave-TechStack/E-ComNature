package com.ecom.backend.service;

import com.ecom.backend.dto.request.BrandRequest;
import com.ecom.backend.dto.response.BrandResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.entity.Brand;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.mapper.BrandMapper;
import com.ecom.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        if (brandRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Brand with slug '" + request.getSlug() + "' already exists");
        }

        Brand brand = new Brand();
        updateBrandFromRequest(brand, request);
        brand = brandRepository.save(brand);
        return brandMapper.toResponse(brand);
    }

    @Transactional
    public BrandResponse updateBrand(Long id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        updateBrandFromRequest(brand, request);
        brand = brandRepository.save(brand);
        return brandMapper.toResponse(brand);
    }

    private void updateBrandFromRequest(Brand brand, BrandRequest request) {
        if (request.getName() != null) brand.setName(request.getName());
        if (request.getSlug() != null) brand.setSlug(request.getSlug());
        if (request.getDescription() != null) brand.setDescription(request.getDescription());
        if (request.getLogo() != null) brand.setLogo(request.getLogo());
        if (request.getCoverImage() != null) brand.setCoverImage(request.getCoverImage());
        if (request.getIsFeatured() != null) brand.setIsFeatured(request.getIsFeatured());
        if (request.getDisplayOrder() != null) brand.setDisplayOrder(request.getDisplayOrder());
        if (request.getMetaTitle() != null) brand.setMetaTitle(request.getMetaTitle());
        if (request.getMetaDescription() != null) brand.setMetaDescription(request.getMetaDescription());
    }

    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        brand.setIsActive(false);
        brand.softDelete();
        brandRepository.save(brand);
    }

    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        return brandMapper.toResponse(brand);
    }

    public List<BrandResponse> getAllBrands() {
        List<Brand> brands = brandRepository.findByIsActiveTrueAndIsDeletedFalse();
        return brandMapper.toResponseList(brands);
    }

    public PagedResponse<BrandResponse> getBrands(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Brand> brandPage = brandRepository.findByIsActiveTrueAndIsDeletedFalse(pageable);
        return PagedResponse.<BrandResponse>builder()
                .content(brandMapper.toResponseList(brandPage.getContent()))
                .page(brandPage.getNumber())
                .size(brandPage.getSize())
                .totalElements(brandPage.getTotalElements())
                .totalPages(brandPage.getTotalPages())
                .first(brandPage.isFirst())
                .last(brandPage.isLast())
                .build();
    }

    public List<BrandResponse> getFeaturedBrands() {
        List<Brand> brands = brandRepository.findByIsFeaturedTrueAndIsActiveTrueAndIsDeletedFalse();
        return brandMapper.toResponseList(brands);
    }

    public PagedResponse<BrandResponse> searchBrands(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Brand> brandPage = brandRepository.searchBrands(search, pageable);
        return PagedResponse.<BrandResponse>builder()
                .content(brandMapper.toResponseList(brandPage.getContent()))
                .page(brandPage.getNumber())
                .size(brandPage.getSize())
                .totalElements(brandPage.getTotalElements())
                .totalPages(brandPage.getTotalPages())
                .first(brandPage.isFirst())
                .last(brandPage.isLast())
                .build();
    }
}
