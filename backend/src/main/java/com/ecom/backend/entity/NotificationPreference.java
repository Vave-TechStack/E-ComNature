package com.ecom.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification_preferences")
public class NotificationPreference extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "order_email")
    private Boolean orderEmail = true;

    @Column(name = "order_sms")
    private Boolean orderSms = true;

    @Column(name = "order_push")
    private Boolean orderPush = true;

    @Column(name = "order_whatsapp")
    private Boolean orderWhatsapp = true;

    @Column(name = "payment_email")
    private Boolean paymentEmail = true;

    @Column(name = "payment_sms")
    private Boolean paymentSms = true;

    @Column(name = "payment_push")
    private Boolean paymentPush = true;

    @Column(name = "payment_whatsapp")
    private Boolean paymentWhatsapp = false;

    @Column(name = "offer_email")
    private Boolean offerEmail = true;

    @Column(name = "offer_sms")
    private Boolean offerSms = false;

    @Column(name = "offer_push")
    private Boolean offerPush = true;

    @Column(name = "offer_whatsapp")
    private Boolean offerWhatsapp = true;

    @Column(name = "shipping_email")
    private Boolean shippingEmail = true;

    @Column(name = "shipping_sms")
    private Boolean shippingSms = true;

    @Column(name = "shipping_push")
    private Boolean shippingPush = true;

    @Column(name = "shipping_whatsapp")
    private Boolean shippingWhatsapp = true;

    @Column(name = "marketing_email")
    private Boolean marketingEmail = true;

    @Column(name = "marketing_sms")
    private Boolean marketingSms = false;

    @Column(name = "marketing_push")
    private Boolean marketingPush = false;

    @Column(name = "marketing_whatsapp")
    private Boolean marketingWhatsapp = false;

    @Column(name = "review_email")
    private Boolean reviewEmail = true;

    @Column(name = "review_sms")
    private Boolean reviewSms = false;

    @Column(name = "review_push")
    private Boolean reviewPush = true;

    @Column(name = "review_whatsapp")
    private Boolean reviewWhatsapp = false;

    @Column(name = "rewards_email")
    private Boolean rewardsEmail = true;

    @Column(name = "rewards_sms")
    private Boolean rewardsSms = false;

    @Column(name = "rewards_push")
    private Boolean rewardsPush = true;

    @Column(name = "rewards_whatsapp")
    private Boolean rewardsWhatsapp = false;

    @Column(name = "return_email")
    private Boolean returnEmail = true;

    @Column(name = "return_sms")
    private Boolean returnSms = true;

    @Column(name = "return_push")
    private Boolean returnPush = true;

    @Column(name = "return_whatsapp")
    private Boolean returnWhatsapp = true;

    @Column(name = "wishlist_email")
    private Boolean wishlistEmail = false;

    @Column(name = "wishlist_sms")
    private Boolean wishlistSms = false;

    @Column(name = "wishlist_push")
    private Boolean wishlistPush = true;

    @Column(name = "wishlist_whatsapp")
    private Boolean wishlistWhatsapp = false;

    @Column(name = "security_email")
    private Boolean securityEmail = true;

    @Column(name = "security_sms")
    private Boolean securitySms = true;

    @Column(name = "security_push")
    private Boolean securityPush = true;

    @Column(name = "security_whatsapp")
    private Boolean securityWhatsapp = true;

    @Column(name = "email_frequency", length = 20)
    private String emailFrequency = "daily";

    @Column(name = "quiet_hours_enabled")
    private Boolean quietHoursEnabled = false;

    @Column(name = "quiet_hours_from", length = 10)
    private String quietHoursFrom = "22:00";

    @Column(name = "quiet_hours_to", length = 10)
    private String quietHoursTo = "06:00";
}
