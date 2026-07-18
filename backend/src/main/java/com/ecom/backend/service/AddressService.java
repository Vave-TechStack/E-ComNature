package com.ecom.backend.service;

import com.ecom.backend.dto.request.AddressRequest;
import com.ecom.backend.dto.response.AddressResponse;
import com.ecom.backend.entity.Address;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.AddressRepository;
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
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> getUserAddresses(Long userId) {
        return addressRepository.findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AddressResponse getAddress(Long userId, Long addressId) {
        Address address = findAddressById(userId, addressId);
        return mapToResponse(address);
    }

    @Transactional
    public AddressResponse createAddress(Long userId, AddressRequest request) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Address address = new Address();
        address.setUser(user);
        applyRequest(address, request);

        // Handle default address
        if (Boolean.TRUE.equals(request.getIsDefault()) || isFirstAddress(userId)) {
            addressRepository.clearDefaultAddresses(userId);
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }

        address = addressRepository.save(address);
        log.info("Address created for user: {}, label: {}", user.getEmail(), address.getLabel());
        return mapToResponse(address);
    }

    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = findAddressById(userId, addressId);
        applyRequest(address, request);

        // Handle default address
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultAddresses(userId);
            address.setIsDefault(true);
        }

        address = addressRepository.save(address);
        log.info("Address updated for user: {}, label: {}", userId, address.getLabel());
        return mapToResponse(address);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = findAddressById(userId, addressId);
        address.softDelete();
        addressRepository.save(address);
        log.info("Address deleted for user: {}, label: {}", userId, address.getLabel());
    }

    @Transactional
    public AddressResponse setDefaultAddress(Long userId, Long addressId) {
        Address address = findAddressById(userId, addressId);
        addressRepository.clearDefaultAddresses(userId);
        address.setIsDefault(true);
        address = addressRepository.save(address);
        log.info("Default address set to: {} for user: {}", addressId, userId);
        return mapToResponse(address);
    }

    private Address findAddressById(Long userId, Long addressId) {
        return addressRepository.findByIdAndUserIdAndIsDeletedFalse(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
    }

    private boolean isFirstAddress(Long userId) {
        return addressRepository.countByUserIdAndIsDeletedFalse(userId) == 0;
    }

    private void applyRequest(Address address, AddressRequest request) {
        address.setLabel(request.getLabel());
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAlternatePhone(request.getAlternatePhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        if (request.getCountry() != null) {
            address.setCountry(request.getCountry());
        }
        if (request.getAddressType() != null) {
            address.setAddressType(request.getAddressType());
        }
        if (request.getLatitude() != null) {
            address.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            address.setLongitude(request.getLongitude());
        }
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .label(address.getLabel())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .alternatePhone(address.getAlternatePhone())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .landmark(address.getLandmark())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .country(address.getCountry())
                .isDefault(address.getIsDefault())
                .addressType(address.getAddressType())
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .createdAt(address.getCreatedAt())
                .build();
    }
}
