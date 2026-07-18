package com.ecom.backend.service;

import com.ecom.backend.dto.request.SavedCardRequest;
import com.ecom.backend.dto.request.SavedUPIRequest;
import com.ecom.backend.dto.response.SavedCardResponse;
import com.ecom.backend.dto.response.SavedUPIResponse;
import com.ecom.backend.entity.SavedCard;
import com.ecom.backend.entity.SavedUPI;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.DuplicateResourceException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.SavedCardRepository;
import com.ecom.backend.repository.SavedUPIRepository;
import com.ecom.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentMethodService {

    private final SavedCardRepository savedCardRepository;
    private final SavedUPIRepository savedUPIRepository;
    private final UserRepository userRepository;

    // ============ SAVED CARDS ============

    public List<SavedCardResponse> getSavedCards(Long userId) {
        return savedCardRepository.findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(this::mapCardToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SavedCardResponse saveCard(Long userId, SavedCardRequest request) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        SavedCard card = new SavedCard();
        card.setUser(user);
        card.setCardToken(request.getCardToken());
        card.setLastFourDigits(request.getLastFourDigits());
        card.setCardBrand(request.getCardBrand());
        card.setCardType(request.getCardType());
        card.setCardHolderName(request.getCardHolderName());
        card.setExpiryMonth(request.getExpiryMonth());
        card.setExpiryYear(request.getExpiryYear());

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            savedCardRepository.clearDefaultCards(userId);
            card.setIsDefault(true);
        } else {
            card.setIsDefault(false);
        }

        card = savedCardRepository.save(card);
        log.info("Card saved for user: {}, brand: {}, last4: {}", userId, card.getCardBrand(), card.getLastFourDigits());
        return mapCardToResponse(card);
    }

    @Transactional
    public void deleteCard(Long userId, Long cardId) {
        SavedCard card = savedCardRepository.findByIdAndUserIdAndIsDeletedFalse(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("SavedCard", "id", cardId));
        card.softDelete();
        savedCardRepository.save(card);
        log.info("Card deleted for user: {}, card: {}", userId, cardId);
    }

    @Transactional
    public SavedCardResponse setDefaultCard(Long userId, Long cardId) {
        SavedCard card = savedCardRepository.findByIdAndUserIdAndIsDeletedFalse(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("SavedCard", "id", cardId));
        savedCardRepository.clearDefaultCards(userId);
        card.setIsDefault(true);
        card = savedCardRepository.save(card);
        log.info("Default card set: {} for user: {}", cardId, userId);
        return mapCardToResponse(card);
    }

    // ============ SAVED UPIS ============

    public List<SavedUPIResponse> getSavedUPIs(Long userId) {
        return savedUPIRepository.findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(this::mapUpiToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SavedUPIResponse saveUPI(Long userId, SavedUPIRequest request) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (savedUPIRepository.existsByUserIdAndUpiIdAndIsDeletedFalse(userId, request.getUpiId())) {
            throw new DuplicateResourceException("UPI ID already saved");
        }

        SavedUPI upi = new SavedUPI();
        upi.setUser(user);
        upi.setUpiId(request.getUpiId());

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            savedUPIRepository.clearDefaultUPIs(userId);
            upi.setIsDefault(true);
        } else {
            upi.setIsDefault(false);
        }

        upi = savedUPIRepository.save(upi);
        log.info("UPI saved for user: {}, upi: {}", userId, upi.getUpiId());
        return mapUpiToResponse(upi);
    }

    @Transactional
    public void deleteUPI(Long userId, Long upiId) {
        SavedUPI upi = savedUPIRepository.findByIdAndUserIdAndIsDeletedFalse(upiId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("SavedUPI", "id", upiId));
        upi.softDelete();
        savedUPIRepository.save(upi);
        log.info("UPI deleted for user: {}, upiId: {}", userId, upiId);
    }

    @Transactional
    public SavedUPIResponse setDefaultUPI(Long userId, Long upiId) {
        SavedUPI upi = savedUPIRepository.findByIdAndUserIdAndIsDeletedFalse(upiId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("SavedUPI", "id", upiId));
        savedUPIRepository.clearDefaultUPIs(userId);
        upi.setIsDefault(true);
        upi = savedUPIRepository.save(upi);
        log.info("Default UPI set: {} for user: {}", upiId, userId);
        return mapUpiToResponse(upi);
    }

    public long getSavedPaymentMethodsCount(Long userId) {
        return savedCardRepository.countByUserIdAndIsDeletedFalse(userId)
             + savedUPIRepository.findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(userId).size();
    }

    private SavedCardResponse mapCardToResponse(SavedCard card) {
        return SavedCardResponse.builder()
                .id(card.getId())
                .cardHolderName(card.getCardHolderName())
                .lastFourDigits(card.getLastFourDigits())
                .cardBrand(card.getCardBrand())
                .cardType(card.getCardType())
                .expiryMonth(card.getExpiryMonth())
                .expiryYear(card.getExpiryYear())
                .isDefault(card.getIsDefault())
                .build();
    }

    private SavedUPIResponse mapUpiToResponse(SavedUPI upi) {
        return SavedUPIResponse.builder()
                .id(upi.getId())
                .upiId(upi.getUpiId())
                .isDefault(upi.getIsDefault())
                .isVerified(upi.getIsVerified())
                .build();
    }
}
