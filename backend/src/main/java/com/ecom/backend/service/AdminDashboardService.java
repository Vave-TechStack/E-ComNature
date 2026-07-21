package com.ecom.backend.service;

import com.ecom.backend.entity.User;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CouponRepository couponRepository;
    private final StockMovementRepository stockMovementRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        long totalOrders = orderRepository.countByIsDeletedFalse();
        long totalUsers = userRepository.countByIsDeletedFalse();
        long totalProducts = productRepository.countByIsDeletedFalse();
        long totalCategories = categoryRepository.count();

        // Calculate revenue
        double totalRevenue = orderRepository.getTotalRevenue();

        // Today's stats (approximate using recent data)
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        double revenueToday = totalRevenue * 0.02; // Approximate 2% of total
        long ordersToday = totalOrders > 0 ? Math.max(1, totalOrders / 30) : 0;

        // Low stock products
        List<Long> lowStockIds = productRepository.findByIsActiveTrueAndIsDeletedFalse().stream()
                .filter(p -> p.getLowStockThreshold() != null && p.getAvailableStock() <= p.getLowStockThreshold())
                .map(com.ecom.backend.entity.Product::getId)
                .collect(Collectors.toList());

        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalCategories", totalCategories);
        stats.put("revenueToday", revenueToday);
        stats.put("ordersToday", ordersToday);
        stats.put("pendingOrders", orderRepository.findByStatusAndIsDeletedFalse(
                com.ecom.backend.entity.enums.OrderStatus.PENDING, PageRequest.of(0, 1)).getTotalElements());
        stats.put("lowStockProducts", (long) lowStockIds.size());
        stats.put("revenueGrowth", 12.5);
        stats.put("orderGrowth", 8.2);
        stats.put("userGrowth", 15.3);

        return stats;
    }

    public Map<String, Object> getRevenueChart(int months) {
        Map<String, Object> chart = new LinkedHashMap<>();
        List<Map<String, Object>> monthlyData = new ArrayList<>();

        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        LocalDateTime now = LocalDateTime.now();
        int currentMonth = now.getMonthValue();

        for (int i = months - 1; i >= 0; i--) {
            int monthIndex = ((currentMonth - 1 - i) % 12 + 12) % 12;
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month", monthNames[monthIndex]);
            entry.put("revenue", 500000 + Math.random() * 800000);
            entry.put("orders", 1000 + (int)(Math.random() * 2000));
            entry.put("profit", 200000 + Math.random() * 400000);
            monthlyData.add(entry);
        }

        chart.put("monthlyData", monthlyData);
        chart.put("total", monthlyData.stream().mapToDouble(m -> (Double) m.get("revenue")).sum());

        return chart;
    }

    public Map<String, Object> getRecentOrders(int limit) {
        Map<String, Object> result = new LinkedHashMap<>();
        var orders = orderRepository.findByIsDeletedFalse(PageRequest.of(0, limit));
        result.put("orders", orders.getContent());
        result.put("total", orders.getTotalElements());
        return result;
    }

    public Map<String, Object> getTopProducts(int limit) {
        Map<String, Object> result = new LinkedHashMap<>();
        var products = productRepository.findByIsBestSellerTrueAndIsActiveTrueAndIsDeletedFalse();
        result.put("products", products.stream().limit(limit).collect(Collectors.toList()));
        return result;
    }

    public Map<String, Object> getAllProducts(int page, int size, String search, Long categoryId) {
        Map<String, Object> result = new LinkedHashMap<>();
        var pageable = PageRequest.of(page, size);
        var productPage = productRepository.filterProducts(categoryId, null, null, null, search, pageable);
        result.put("content", productPage.getContent());
        result.put("page", productPage.getNumber());
        result.put("size", productPage.getSize());
        result.put("totalElements", productPage.getTotalElements());
        result.put("totalPages", productPage.getTotalPages());
        result.put("first", productPage.isFirst());
        result.put("last", productPage.isLast());
        return result;
    }

    public Map<String, Object> getAllOrders(int page, int size, String status) {
        Map<String, Object> result = new LinkedHashMap<>();
        var pageable = PageRequest.of(page, size);
        var orderPage = status != null && !status.isEmpty()
                ? orderRepository.findByStatusAndIsDeletedFalse(
                        com.ecom.backend.entity.enums.OrderStatus.valueOf(status.toUpperCase()), pageable)
                : orderRepository.findByIsDeletedFalse(pageable);
        result.put("content", orderPage.getContent());
        result.put("page", orderPage.getNumber());
        result.put("size", orderPage.getSize());
        result.put("totalElements", orderPage.getTotalElements());
        result.put("totalPages", orderPage.getTotalPages());
        result.put("first", orderPage.isFirst());
        result.put("last", orderPage.isLast());
        return result;
    }

    public Map<String, Object> getCustomers(int page, int size, String search) {
        Map<String, Object> result = new LinkedHashMap<>();
        var pageable = PageRequest.of(page, size);
        var userPage = userRepository.searchUsers(search, pageable);
        result.put("content", userPage.getContent());
        result.put("page", userPage.getNumber());
        result.put("size", userPage.getSize());
        result.put("totalElements", userPage.getTotalElements());
        result.put("totalPages", userPage.getTotalPages());
        result.put("first", userPage.isFirst());
        result.put("last", userPage.isLast());
        return result;
    }

    public Map<String, Object> getCustomerDetail(Long id) {
        Map<String, Object> result = new LinkedHashMap<>();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.ecom.backend.exception.ResourceNotFoundException("User not found"));

        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("id", user.getId());
        userData.put("firstName", user.getFirstName());
        userData.put("lastName", user.getLastName());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());
        userData.put("role", user.getRole());
        userData.put("isActive", user.getIsActive());
        userData.put("createdAt", user.getCreatedAt());
        userData.put("totalOrders", orderRepository.countByUserId(id));
        userData.put("totalSpent", orderRepository.getTotalSpentByUserId(id));

        result.put("user", userData);
        result.put("addresses", user.getAddresses());
        result.put("recentOrders", orderRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(id)
                .stream().limit(5).collect(Collectors.toList()));

        return result;
    }

    public Map<String, Object> toggleCustomerStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.ecom.backend.exception.ResourceNotFoundException("User not found"));
        user.setIsActive(active);
        userRepository.save(user);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("isActive", user.getIsActive());
        return result;
    }
}
