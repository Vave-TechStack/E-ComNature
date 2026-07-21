package com.ecom.backend.config;

import com.ecom.backend.entity.Category;
import com.ecom.backend.entity.User;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.repository.CategoryRepository;
import com.ecom.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data — skipping initialization");
            return;
        }

        log.info("===== Initializing Database with Seed Data =====");

        // ========================
        // Seed Users
        // ========================
        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setDisplayName("Admin User");
        admin.setEmail("admin@naturekart.in");
        admin.setPhone("+919900000001");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole(UserRole.ROLE_ADMIN);
        admin.setIsEmailVerified(true);
        admin.setIsPhoneVerified(true);
        admin.setRewardPoints(5000);
        admin.setWalletBalance(25000.0);
        admin.setReferralCode(generateReferralCode());
        userRepository.save(admin);
        log.info("✅ Admin user created: admin@naturekart.in / Admin@123");

        User customer = new User();
        customer.setFirstName("Demo");
        customer.setLastName("User");
        customer.setDisplayName("Demo User");
        customer.setEmail("user@naturekart.in");
        customer.setPhone("+919900000002");
        customer.setPassword(passwordEncoder.encode("User@123"));
        customer.setRole(UserRole.ROLE_CUSTOMER);
        customer.setIsEmailVerified(true);
        customer.setIsPhoneVerified(true);
        customer.setRewardPoints(250);
        customer.setWalletBalance(500.0);
        customer.setReferralCode(generateReferralCode());
        userRepository.save(customer);
        log.info("✅ Customer user created: user@naturekart.in / User@123");

        // ========================
        // Seed Categories
        // ========================
        Category honey = createCategory("Natural Honey", "honey",
                "Pure forest honey from tribal harvesters", "Droplets", true, 1);
        Category millets = createCategory("Millets & Grains", "millets",
                "Organic millets, rice & ancient grains", "Wheat", true, 2);
        Category oils = createCategory("Cold Pressed Oils", "oils",
                "Wood-pressed, chemical-free oils", "Droplet", true, 3);
        Category spices = createCategory("Natural Spices", "spices",
                "Premium spices from hill regions", "Flame", true, 4);
        Category ghee = createCategory("A2 Ghee & Dairy", "ghee",
                "Bilona method A2 desi cow ghee", "Coffee", true, 5);
        Category herbal = createCategory("Herbal & Wellness", "herbal",
                "Organic teas, herbs & wellness", "Leaf", true, 6);
        Category pickles = createCategory("Pickles & Snacks", "pickles",
                "Homemade pickles & traditional snacks", "UtensilsCrossed", true, 7);
        Category jaggery = createCategory("Organic Jaggery", "jaggery",
                "Natural sweeteners from sugarcane and palm", "Candy", true, 8);

        log.info("✅ " + 8 + " categories created");

        log.info("===== Database Initialization Complete =====");
    }

    private Category createCategory(String name, String slug, String description, String icon,
                                     boolean isFeatured, int displayOrder) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setIcon(icon);
        category.setIsFeatured(isFeatured);
        category.setDisplayOrder(displayOrder);
        category.setLevel(0);
        category.setProductCount(0);
        return categoryRepository.save(category);
    }

    private String generateReferralCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
