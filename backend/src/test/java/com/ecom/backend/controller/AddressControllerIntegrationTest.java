package com.ecom.backend.controller;

import com.ecom.backend.config.TestSecurityConfig;
import com.ecom.backend.dto.request.AddressRequest;
import com.ecom.backend.dto.response.AddressResponse;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.entity.User;
import com.ecom.backend.entity.enums.UserRole;
import com.ecom.backend.repository.AddressRepository;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.security.JwtTokenProvider;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = {TestSecurityConfig.class}
)
@ActiveProfiles("test")
class AddressControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private RestTemplate restTemplate;
    private String baseUrl;
    private String authToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        addressRepository.deleteAll();
        restTemplate = new RestTemplate();
        baseUrl = "http://localhost:" + port + "/api/v1/profile/addresses";

        // Seed test user and generate token
        User user = new User();
        user.setFirstName("Address");
        user.setLastName("Tester");
        user.setEmail("address.test@example.com");
        user.setPhone("9988776655");
        user.setPassword(passwordEncoder.encode("Test@1234"));
        user.setDisplayName("Address Tester");
        user.setRole(UserRole.ROLE_CUSTOMER);
        user.setIsActive(true);
        user.setIsDeleted(false);
        user = userRepository.save(user);

        authToken = jwtTokenProvider.generateAccessTokenFromUserId(
            user.getId(), user.getEmail(), user.getRole().name()
        );
    }

    private HttpEntity<?> createAuthRequest(Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(authToken);
        return new HttpEntity<>(body, headers);
    }

    @Nested
    @DisplayName("Address CRUD Operations")
    class AddressCrud {

        private AddressRequest addressRequest;

        @BeforeEach
        void setUp() {
            addressRequest = AddressRequest.builder()
                .label("Home")
                .fullName("Address Tester")
                .phone("9988776655")
                .addressLine1("123 Test Street")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .country("India")
                .isDefault(true)
                .addressType("HOME")
                .build();
        }

        @Test
        @DisplayName("Should create, read, update, and delete an address")
        void shouldCompleteAddressCrud() throws Exception {
            // Step 1: Create address
            ResponseEntity<ApiResponse> createResponse = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                createAuthRequest(addressRequest),
                ApiResponse.class
            );

            assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(createResponse.getBody().isSuccess()).isTrue();

            // Extract address ID from response
            String json = objectMapper.writeValueAsString(createResponse.getBody().getData());
            AddressResponse createdAddress = objectMapper.readValue(json, AddressResponse.class);
            Long addressId = createdAddress.getId();
            assertThat(addressId).isNotNull();

            // Step 2: Get all addresses (should have 1)
            ResponseEntity<ApiResponse> listResponse = restTemplate.exchange(
                baseUrl,
                HttpMethod.GET,
                createAuthRequest(null),
                ApiResponse.class
            );

            assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(listResponse.getBody().isSuccess()).isTrue();

            // Step 3: Get single address by ID
            ResponseEntity<ApiResponse> getResponse = restTemplate.exchange(
                baseUrl + "/" + addressId,
                HttpMethod.GET,
                createAuthRequest(null),
                ApiResponse.class
            );

            assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(getResponse.getBody().isSuccess()).isTrue();

            // Step 4: Update address
            AddressRequest updateRequest = AddressRequest.builder()
                .label("Office")
                .fullName("Address Tester")
                .phone("9988776655")
                .addressLine1("456 Work Avenue")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400002")
                .isDefault(false)
                .addressType("WORK")
                .build();

            ResponseEntity<ApiResponse> updateResponse = restTemplate.exchange(
                baseUrl + "/" + addressId,
                HttpMethod.PUT,
                createAuthRequest(updateRequest),
                ApiResponse.class
            );

            assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(updateResponse.getBody().isSuccess()).isTrue();

            // Step 5: Delete address
            ResponseEntity<ApiResponse> deleteResponse = restTemplate.exchange(
                baseUrl + "/" + addressId,
                HttpMethod.DELETE,
                createAuthRequest(null),
                ApiResponse.class
            );

            assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test
        @DisplayName("Should set default address")
        void shouldSetDefaultAddress() throws Exception {
            // Create two addresses
            AddressRequest home = AddressRequest.builder()
                .label("Home").fullName("User").phone("9988776655")
                .addressLine1("Home St").city("Mumbai").state("Maharashtra")
                .pincode("400001").isDefault(true).build();

            ResponseEntity<ApiResponse> homeResponse = restTemplate.exchange(
                baseUrl, HttpMethod.POST, createAuthRequest(home), ApiResponse.class
            );
            Long homeId = objectMapper.readValue(
                objectMapper.writeValueAsString(homeResponse.getBody().getData()),
                AddressResponse.class
            ).getId();

            AddressRequest office = AddressRequest.builder()
                .label("Office").fullName("User").phone("9988776655")
                .addressLine1("Office St").city("Mumbai").state("Maharashtra")
                .pincode("400002").isDefault(false).build();

            ResponseEntity<ApiResponse> officeResponse = restTemplate.exchange(
                baseUrl, HttpMethod.POST, createAuthRequest(office), ApiResponse.class
            );
            Long officeId = objectMapper.readValue(
                objectMapper.writeValueAsString(officeResponse.getBody().getData()),
                AddressResponse.class
            ).getId();

            // Set office as default
            ResponseEntity<ApiResponse> defaultResponse = restTemplate.exchange(
                baseUrl + "/" + officeId + "/default",
                HttpMethod.PUT,
                createAuthRequest(null),
                ApiResponse.class
            );

            assertThat(defaultResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }
}
