package com.ecom.backend.controller;

import com.ecom.backend.dto.request.AddressRequest;
import com.ecom.backend.dto.response.AddressResponse;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.security.UserPrincipal;
import com.ecom.backend.service.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class AddressControllerTest {

    @Mock private AddressService addressService;

    @InjectMocks private AddressController addressController;

    private UserPrincipal userPrincipal;
    private AddressResponse addressResponse;
    private AddressRequest addressRequest;

    @BeforeEach
    void setUp() {
        userPrincipal = new UserPrincipal(
                1L, "john@example.com", "9876543210",
                "password", "John", "Doe",
                com.ecom.backend.entity.enums.UserRole.ROLE_CUSTOMER,
                true, false, true
        );

        addressResponse = AddressResponse.builder()
                .id(1L)
                .label("Home")
                .fullName("John Doe")
                .phone("9876543210")
                .addressLine1("123 Main St")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .country("India")
                .isDefault(true)
                .addressType("HOME")
                .createdAt(LocalDateTime.now())
                .build();

        addressRequest = AddressRequest.builder()
                .label("Home")
                .fullName("John Doe")
                .phone("9876543210")
                .addressLine1("123 Main St")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .build();
    }

    @Nested
    @DisplayName("Get Addresses Endpoint")
    class GetAddressesEndpoint {

        @Test
        @DisplayName("Should return all addresses")
        void shouldGetAddresses() {
            given(addressService.getUserAddresses(1L)).willReturn(List.of(addressResponse));

            ResponseEntity<ApiResponse<List<AddressResponse>>> response = addressController.getAddresses(userPrincipal);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData()).hasSize(1);
        }
    }

    @Nested
    @DisplayName("Get Address By ID Endpoint")
    class GetAddressByIdEndpoint {

        @Test
        @DisplayName("Should return address by ID")
        void shouldGetAddress() {
            given(addressService.getAddress(1L, 1L)).willReturn(addressResponse);

            ResponseEntity<ApiResponse<AddressResponse>> response = addressController.getAddress(userPrincipal, 1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getLabel()).isEqualTo("Home");
        }
    }

    @Nested
    @DisplayName("Create Address Endpoint")
    class CreateAddressEndpoint {

        @Test
        @DisplayName("Should create address and return 201")
        void shouldCreateAddress() {
            given(addressService.createAddress(eq(1L), any(AddressRequest.class)))
                    .willReturn(addressResponse);

            ResponseEntity<ApiResponse<AddressResponse>> response = addressController.createAddress(userPrincipal, addressRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody().getMessage()).isEqualTo("Address created successfully");
        }
    }

    @Nested
    @DisplayName("Update Address Endpoint")
    class UpdateAddressEndpoint {

        @Test
        @DisplayName("Should update address")
        void shouldUpdateAddress() {
            AddressResponse updated = AddressResponse.builder()
                    .id(1L)
                    .label("Updated Home")
                    .fullName("John Doe")
                    .phone("9876543210")
                    .addressLine1("456 New St")
                    .city("Mumbai")
                    .state("Maharashtra")
                    .pincode("400001")
                    .isDefault(true)
                    .build();

            given(addressService.updateAddress(eq(1L), eq(1L), any(AddressRequest.class)))
                    .willReturn(updated);

            ResponseEntity<ApiResponse<AddressResponse>> response = addressController.updateAddress(userPrincipal, 1L, addressRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getMessage()).isEqualTo("Address updated successfully");
        }
    }

    @Nested
    @DisplayName("Delete Address Endpoint")
    class DeleteAddressEndpoint {

        @Test
        @DisplayName("Should delete address")
        void shouldDeleteAddress() {
            ResponseEntity<ApiResponse<Void>> response = addressController.deleteAddress(userPrincipal, 1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getMessage()).isEqualTo("Address deleted successfully");
            verify(addressService).deleteAddress(1L, 1L);
        }
    }

    @Nested
    @DisplayName("Set Default Address Endpoint")
    class SetDefaultAddressEndpoint {

        @Test
        @DisplayName("Should set address as default")
        void shouldSetDefault() {
            AddressResponse defaultAddress = AddressResponse.builder()
                    .id(2L)
                    .label("Office")
                    .isDefault(true)
                    .build();

            given(addressService.setDefaultAddress(1L, 2L)).willReturn(defaultAddress);

            ResponseEntity<ApiResponse<AddressResponse>> response = addressController.setDefaultAddress(userPrincipal, 2L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getMessage()).isEqualTo("Default address updated");
            assertThat(response.getBody().getData().getIsDefault()).isTrue();
        }
    }
}
