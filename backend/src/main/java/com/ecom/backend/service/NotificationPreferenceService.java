package com.ecom.backend.service;

import com.ecom.backend.dto.request.NotificationPreferenceRequest;
import com.ecom.backend.dto.response.NotificationPreferenceResponse;
import com.ecom.backend.entity.NotificationPreference;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.NotificationPreferenceRepository;
import com.ecom.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final UserRepository userRepository;

    public NotificationPreferenceResponse getPreferences(Long userId) {
        NotificationPreference pref = notificationPreferenceRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .orElseGet(() -> createDefaultPreferences(userId));
        return mapToResponse(pref);
    }

    @Transactional
    public NotificationPreferenceResponse updatePreferences(Long userId, NotificationPreferenceRequest request) {
        NotificationPreference pref = notificationPreferenceRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .orElseGet(() -> createDefaultPreferences(userId));

        applyRequest(pref, request);
        pref = notificationPreferenceRepository.save(pref);
        log.info("Notification preferences updated for user: {}", userId);
        return mapToResponse(pref);
    }

    private NotificationPreference createDefaultPreferences(Long userId) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        NotificationPreference pref = new NotificationPreference();
        pref.setUser(user);
        return notificationPreferenceRepository.save(pref);
    }

    private void applyRequest(NotificationPreference pref, NotificationPreferenceRequest req) {
        // Order
        if (req.getOrderEmail() != null) pref.setOrderEmail(req.getOrderEmail());
        if (req.getOrderSms() != null) pref.setOrderSms(req.getOrderSms());
        if (req.getOrderPush() != null) pref.setOrderPush(req.getOrderPush());
        if (req.getOrderWhatsapp() != null) pref.setOrderWhatsapp(req.getOrderWhatsapp());

        // Payment
        if (req.getPaymentEmail() != null) pref.setPaymentEmail(req.getPaymentEmail());
        if (req.getPaymentSms() != null) pref.setPaymentSms(req.getPaymentSms());
        if (req.getPaymentPush() != null) pref.setPaymentPush(req.getPaymentPush());
        if (req.getPaymentWhatsapp() != null) pref.setPaymentWhatsapp(req.getPaymentWhatsapp());

        // Offers
        if (req.getOfferEmail() != null) pref.setOfferEmail(req.getOfferEmail());
        if (req.getOfferSms() != null) pref.setOfferSms(req.getOfferSms());
        if (req.getOfferPush() != null) pref.setOfferPush(req.getOfferPush());
        if (req.getOfferWhatsapp() != null) pref.setOfferWhatsapp(req.getOfferWhatsapp());

        // Shipping
        if (req.getShippingEmail() != null) pref.setShippingEmail(req.getShippingEmail());
        if (req.getShippingSms() != null) pref.setShippingSms(req.getShippingSms());
        if (req.getShippingPush() != null) pref.setShippingPush(req.getShippingPush());
        if (req.getShippingWhatsapp() != null) pref.setShippingWhatsapp(req.getShippingWhatsapp());

        // Marketing
        if (req.getMarketingEmail() != null) pref.setMarketingEmail(req.getMarketingEmail());
        if (req.getMarketingSms() != null) pref.setMarketingSms(req.getMarketingSms());
        if (req.getMarketingPush() != null) pref.setMarketingPush(req.getMarketingPush());
        if (req.getMarketingWhatsapp() != null) pref.setMarketingWhatsapp(req.getMarketingWhatsapp());

        // Reviews
        if (req.getReviewEmail() != null) pref.setReviewEmail(req.getReviewEmail());
        if (req.getReviewSms() != null) pref.setReviewSms(req.getReviewSms());
        if (req.getReviewPush() != null) pref.setReviewPush(req.getReviewPush());
        if (req.getReviewWhatsapp() != null) pref.setReviewWhatsapp(req.getReviewWhatsapp());

        // Rewards
        if (req.getRewardsEmail() != null) pref.setRewardsEmail(req.getRewardsEmail());
        if (req.getRewardsSms() != null) pref.setRewardsSms(req.getRewardsSms());
        if (req.getRewardsPush() != null) pref.setRewardsPush(req.getRewardsPush());
        if (req.getRewardsWhatsapp() != null) pref.setRewardsWhatsapp(req.getRewardsWhatsapp());

        // Returns
        if (req.getReturnEmail() != null) pref.setReturnEmail(req.getReturnEmail());
        if (req.getReturnSms() != null) pref.setReturnSms(req.getReturnSms());
        if (req.getReturnPush() != null) pref.setReturnPush(req.getReturnPush());
        if (req.getReturnWhatsapp() != null) pref.setReturnWhatsapp(req.getReturnWhatsapp());

        // Wishlist
        if (req.getWishlistEmail() != null) pref.setWishlistEmail(req.getWishlistEmail());
        if (req.getWishlistSms() != null) pref.setWishlistSms(req.getWishlistSms());
        if (req.getWishlistPush() != null) pref.setWishlistPush(req.getWishlistPush());
        if (req.getWishlistWhatsapp() != null) pref.setWishlistWhatsapp(req.getWishlistWhatsapp());

        // Security
        if (req.getSecurityEmail() != null) pref.setSecurityEmail(req.getSecurityEmail());
        if (req.getSecuritySms() != null) pref.setSecuritySms(req.getSecuritySms());
        if (req.getSecurityPush() != null) pref.setSecurityPush(req.getSecurityPush());
        if (req.getSecurityWhatsapp() != null) pref.setSecurityWhatsapp(req.getSecurityWhatsapp());

        // General
        if (req.getEmailFrequency() != null) pref.setEmailFrequency(req.getEmailFrequency());
        if (req.getQuietHoursEnabled() != null) pref.setQuietHoursEnabled(req.getQuietHoursEnabled());
        if (req.getQuietHoursFrom() != null) pref.setQuietHoursFrom(req.getQuietHoursFrom());
        if (req.getQuietHoursTo() != null) pref.setQuietHoursTo(req.getQuietHoursTo());
    }

    private NotificationPreferenceResponse mapToResponse(NotificationPreference pref) {
        return NotificationPreferenceResponse.builder()
                .orderEmail(pref.getOrderEmail())
                .orderSms(pref.getOrderSms())
                .orderPush(pref.getOrderPush())
                .orderWhatsapp(pref.getOrderWhatsapp())
                .paymentEmail(pref.getPaymentEmail())
                .paymentSms(pref.getPaymentSms())
                .paymentPush(pref.getPaymentPush())
                .paymentWhatsapp(pref.getPaymentWhatsapp())
                .offerEmail(pref.getOfferEmail())
                .offerSms(pref.getOfferSms())
                .offerPush(pref.getOfferPush())
                .offerWhatsapp(pref.getOfferWhatsapp())
                .shippingEmail(pref.getShippingEmail())
                .shippingSms(pref.getShippingSms())
                .shippingPush(pref.getShippingPush())
                .shippingWhatsapp(pref.getShippingWhatsapp())
                .marketingEmail(pref.getMarketingEmail())
                .marketingSms(pref.getMarketingSms())
                .marketingPush(pref.getMarketingPush())
                .marketingWhatsapp(pref.getMarketingWhatsapp())
                .reviewEmail(pref.getReviewEmail())
                .reviewSms(pref.getReviewSms())
                .reviewPush(pref.getReviewPush())
                .reviewWhatsapp(pref.getReviewWhatsapp())
                .rewardsEmail(pref.getRewardsEmail())
                .rewardsSms(pref.getRewardsSms())
                .rewardsPush(pref.getRewardsPush())
                .rewardsWhatsapp(pref.getRewardsWhatsapp())
                .returnEmail(pref.getReturnEmail())
                .returnSms(pref.getReturnSms())
                .returnPush(pref.getReturnPush())
                .returnWhatsapp(pref.getReturnWhatsapp())
                .wishlistEmail(pref.getWishlistEmail())
                .wishlistSms(pref.getWishlistSms())
                .wishlistPush(pref.getWishlistPush())
                .wishlistWhatsapp(pref.getWishlistWhatsapp())
                .securityEmail(pref.getSecurityEmail())
                .securitySms(pref.getSecuritySms())
                .securityPush(pref.getSecurityPush())
                .securityWhatsapp(pref.getSecurityWhatsapp())
                .emailFrequency(pref.getEmailFrequency())
                .quietHoursEnabled(pref.getQuietHoursEnabled())
                .quietHoursFrom(pref.getQuietHoursFrom())
                .quietHoursTo(pref.getQuietHoursTo())
                .build();
    }
}
