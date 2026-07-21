package com.ecom.backend.service;

import com.ecom.backend.dto.request.AddressRequest;
import com.ecom.backend.dto.response.AddressResponse;
import com.ecom.backend.entity.Address;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.AddressRepository;
import com.ecom.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class AddressServiceTest {

    @Mock private AddressRepository addressRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private AddressService addressService;

    private User user;
    private Address address1;
    private Address address2;
    private AddressRequest addressRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setEmail("john@example.com");

        address1 = new Address();
        address1.setId(1L);
        address1.setUser(user);
        address1.setLabel("Home");
        address1.setFullName("John Doe");
        address1.setPhone("9876543210");
        address1.setAddressLine1("123 Main St");
        address1.setCity("Mumbai");
        address1.setState("Maharashtra");
        address1.setPincode("400001");
        address1.setCountry("India");
        address1.setIsDefault(true);
        address1.setAddressType("HOME");
        address1.setCreatedAt(LocalDateTime.now());

        address2 = new Address();
        address2.setId(2L);
        address2.setUser(user);
        address2.setLabel("Office");
        address2.setFullName("John Doe");
        address2.setPhone("9876543210");
        address2.setAddressLine1("456 Work Ave");
        address2.setCity("Mumbai");
        address2.setState("Maharashtra");
        address2.setPincode("400002");
        address2.setCountry("India");
        address2.setIsDefault(false);
        address2.setAddressType("WORK");

        addressRequest = AddressRequest.builder()
                .label("New Home")
                .fullName("John Doe")
                .phone("9876543210")
                .addressLine1("789 New St")
                .city("Delhi")
                .state("Delhi")
                .pincode("110001")
                .country("India")
                .isDefault(true)
                .addressType("HOME")
                .build();
    }

    @Nested
    @DisplayName("Get Addresses Tests")
    class GetAddressesTests {

        @Test
        @DisplayName("Should return all user addresses")
        void shouldReturnUserAddresses() {
            given(addressRepository.findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(1L))
                    .willReturn(Arrays.asList(address1, address2));

            List<AddressResponse> addresses = addressService.getUserAddresses(1L);

            assertThat(addresses).hasSize(2);
            assertThat(addresses.get(0).getLabel()).isEqualTo("Home");
            assertThat(addresses.get(1).getLabel()).isEqualTo("Office");
        }

        @Test
        @DisplayName("Should return empty list when no addresses")
        void shouldReturnEmptyList() {
            given(addressRepository.findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(1L))
                    .willReturn(List.of());

            List<AddressResponse> addresses = addressService.getUserAddresses(1L);

            assertThat(addresses).isEmpty();
        }
    }

    @Nested
    @DisplayName("Get Single Address Tests")
    class GetSingleAddressTests {

        @Test
        @DisplayName("Should return address by id")
        void shouldReturnAddress() {
            given(addressRepository.findByIdAndUserIdAndIsDeletedFalse(1L, 1L))
                    .willReturn(Optional.of(address1));

            AddressResponse response = addressService.getAddress(1L, 1L);

            assertThat(response).isNotNull();
            assertThat(response.getLabel()).isEqualTo("Home");
        }

        @Test
        @DisplayName("Should throw exception when address not found")
        void shouldThrowException() {
            given(addressRepository.findByIdAndUserIdAndIsDeletedFalse(99L, 1L))
                    .willReturn(Optional.empty());

            assertThatThrownBy(() -> addressService.getAddress(1L, 99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Create Address Tests")
    class CreateAddressTests {

        @Test
        @DisplayName("Should create address successfully")
        void shouldCreateAddress() {
            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(addressRepository.save(any(Address.class))).willAnswer(invocation -> {
                Address saved = invocation.getArgument(0);
                saved.setId(3L);
                return saved;
            });

            AddressResponse response = addressService.createAddress(1L, addressRequest);

            assertThat(response).isNotNull();
            assertThat(response.getLabel()).isEqualTo("New Home");
            assertThat(response.getCity()).isEqualTo("Delhi");
            verify(addressRepository).clearDefaultAddresses(1L);
        }

        @Test
        @DisplayName("Should set first address as default automatically")
        void shouldSetFirstAddressAsDefault() {
            given(userRepository.findByIdAndIsDeletedFalse(1L)).willReturn(Optional.of(user));
            given(addressRepository.countByUserIdAndIsDeletedFalse(1L)).willReturn(0L);
            given(addressRepository.save(any(Address.class))).willAnswer(invocation -> {
                Address saved = invocation.getArgument(0);
                saved.setId(3L);
                return saved;
            });

            AddressRequest request = AddressRequest.builder()
                    .label("First Address")
                    .fullName("John Doe")
                    .phone("9876543210")
                    .addressLine1("First St")
                    .city("Mumbai")
                    .state("Maharashtra")
                    .pincode("400001")
                    .build();

            AddressResponse response = addressService.createAddress(1L, request);

            assertThat(response).isNotNull();
            verify(addressRepository).clearDefaultAddresses(1L);
        }
    }

    @Nested
    @DisplayName("Update Address Tests")
    class UpdateAddressTests {

        @Test
        @DisplayName("Should update address successfully")
        void shouldUpdateAddress() {
            given(addressRepository.findByIdAndUserIdAndIsDeletedFalse(1L, 1L))
                    .willReturn(Optional.of(address1));
            given(addressRepository.save(any(Address.class))).willAnswer(invocation -> invocation.getArgument(0));

            AddressResponse response = addressService.updateAddress(1L, 1L, addressRequest);

            assertThat(response.getLabel()).isEqualTo("New Home");
            assertThat(response.getCity()).isEqualTo("Delhi");
            verify(addressRepository).clearDefaultAddresses(1L);
        }
    }

    @Nested
    @DisplayName("Delete Address Tests")
    class DeleteAddressTests {

        @Test
        @DisplayName("Should soft delete address")
        void shouldSoftDeleteAddress() {
            given(addressRepository.findByIdAndUserIdAndIsDeletedFalse(1L, 1L))
                    .willReturn(Optional.of(address1));

            addressService.deleteAddress(1L, 1L);

            assertThat(address1.getIsDeleted()).isTrue();
            verify(addressRepository).save(address1);
        }
    }

    @Nested
    @DisplayName("Set Default Address Tests")
    class SetDefaultAddressTests {

        @Test
        @DisplayName("Should set address as default")
        void shouldSetDefaultAddress() {
            given(addressRepository.findByIdAndUserIdAndIsDeletedFalse(2L, 1L))
                    .willReturn(Optional.of(address2));
            given(addressRepository.save(any(Address.class))).willAnswer(invocation -> invocation.getArgument(0));

            AddressResponse response = addressService.setDefaultAddress(1L, 2L);

            assertThat(response.getIsDefault()).isTrue();
            verify(addressRepository).clearDefaultAddresses(1L);
        }
    }
}
