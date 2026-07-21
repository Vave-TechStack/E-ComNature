package com.ecom.backend.service;

import com.ecom.backend.dto.request.InventoryRequest;
import com.ecom.backend.dto.response.InventoryResponse;
import com.ecom.backend.dto.response.PagedResponse;
import com.ecom.backend.entity.Product;
import com.ecom.backend.entity.StockMovement;
import com.ecom.backend.entity.User;
import com.ecom.backend.entity.enums.StockMovementType;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.ProductRepository;
import com.ecom.backend.repository.StockMovementRepository;
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
public class InventoryService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final UserRepository userRepository;

    @Transactional
    public InventoryResponse adjustStock(Long userId, InventoryRequest request) {
        Product product = productRepository.findByIdAndIsDeletedFalse(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        User adjustedBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StockMovementType movementType = StockMovementType.valueOf(request.getMovementType());
        int quantityBefore = product.getAvailableStock();
        int quantityChange = request.getQuantity();

        switch (movementType) {
            case STOCK_IN:
            case RETURN:
                product.setTotalStock(product.getTotalStock() + quantityChange);
                product.setAvailableStock(product.getAvailableStock() + quantityChange);
                break;
            case STOCK_OUT:
            case DAMAGED:
            case EXPIRED:
                if (product.getAvailableStock() < quantityChange) {
                    throw new BadRequestException("Insufficient stock");
                }
                product.setTotalStock(product.getTotalStock() - quantityChange);
                product.setAvailableStock(product.getAvailableStock() - quantityChange);
                break;
            case ADJUSTMENT:
                int diff = quantityChange - product.getAvailableStock();
                product.setTotalStock(product.getTotalStock() + diff);
                product.setAvailableStock(quantityChange);
                break;
            default:
                throw new BadRequestException("Unsupported movement type: " + movementType);
        }

        productRepository.save(product);

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setMovementType(movementType);
        movement.setQuantity(quantityChange);
        movement.setQuantityBefore(quantityBefore);
        movement.setQuantityAfter(product.getAvailableStock());
        movement.setNotes(request.getNotes());
        movement.setLocation(request.getLocation());
        movement.setAdjustedBy(adjustedBy);
        movement = stockMovementRepository.save(movement);

        return toResponse(movement, product);
    }

    public PagedResponse<InventoryResponse> getStockMovements(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StockMovement> movementPage = stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        return toPagedResponse(movementPage);
    }

    public List<Product> getLowStockProducts() {
        // Products where available stock <= low stock threshold
        return productRepository.findByIsActiveTrueAndIsDeletedFalse().stream()
                .filter(p -> p.getLowStockThreshold() != null && p.getAvailableStock() <= p.getLowStockThreshold())
                .collect(Collectors.toList());
    }

    private InventoryResponse toResponse(StockMovement movement, Product product) {
        return InventoryResponse.builder()
                .id(movement.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productSku(product.getSku())
                .movementType(movement.getMovementType().name())
                .quantity(movement.getQuantity())
                .quantityBefore(movement.getQuantityBefore())
                .quantityAfter(movement.getQuantityAfter())
                .notes(movement.getNotes())
                .adjustedBy(movement.getAdjustedBy() != null ? movement.getAdjustedBy().getFullName() : null)
                .createdAt(movement.getCreatedAt())
                .build();
    }

    private PagedResponse<InventoryResponse> toPagedResponse(Page<StockMovement> page) {
        List<InventoryResponse> content = page.getContent().stream()
                .map(m -> toResponse(m, m.getProduct()))
                .collect(Collectors.toList());
        return PagedResponse.<InventoryResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
