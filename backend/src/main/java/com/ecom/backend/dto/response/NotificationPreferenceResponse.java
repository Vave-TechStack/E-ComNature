package com.ecom.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceResponse {
    private Boolean orderEmail;
    private Boolean orderSms;
    private Boolean orderPush;
    private Boolean orderWhatsapp;

    private Boolean paymentEmail;
    private Boolean paymentSms;
    private Boolean paymentPush;
    private Boolean paymentWhatsapp;

    private Boolean offerEmail;
    private Boolean offerSms;
    private Boolean offerPush;
    private Boolean offerWhatsapp;

    private Boolean shippingEmail;
    private Boolean shippingSms;
    private Boolean shippingPush;
    private Boolean shippingWhatsapp;

    private Boolean marketingEmail;
    private Boolean marketingSms;
    private Boolean marketingPush;
    private Boolean marketingWhatsapp;

    private Boolean reviewEmail;
    private Boolean reviewSms;
    private Boolean reviewPush;
    private Boolean reviewWhatsapp;

    private Boolean rewardsEmail;
    private Boolean rewardsSms;
    private Boolean rewardsPush;
    private Boolean rewardsWhatsapp;

    private Boolean returnEmail;
    private Boolean returnSms;
    private Boolean returnPush;
    private Boolean returnWhatsapp;

    private Boolean wishlistEmail;
    private Boolean wishlistSms;
    private Boolean wishlistPush;
    private Boolean wishlistWhatsapp;

    private Boolean securityEmail;
    private Boolean securitySms;
    private Boolean securityPush;
    private Boolean securityWhatsapp;

    private String emailFrequency;
    private Boolean quietHoursEnabled;
    private String quietHoursFrom;
    private String quietHoursTo;
}
