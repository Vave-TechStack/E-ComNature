package com.ecom.backend.exception;

import com.ecom.backend.dto.response.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @Mock private WebRequest webRequest;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Nested
    @DisplayName("Resource Not Found Handler")
    class ResourceNotFoundHandler {

        @Test
        @DisplayName("Should return 404 with error message")
        void shouldHandleResourceNotFound() {
            ResourceNotFoundException ex = new ResourceNotFoundException("User", "id", 99L);

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleResourceNotFound(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().isSuccess()).isFalse();
            assertThat(response.getBody().getErrorCode()).isEqualTo("NOT_FOUND");
            assertThat(response.getBody().getMessage()).contains("User not found with id:");
        }
    }

    @Nested
    @DisplayName("Bad Request Handler")
    class BadRequestHandler {

        @Test
        @DisplayName("Should return 400 with error message")
        void shouldHandleBadRequest() {
            BadRequestException ex = new BadRequestException("Invalid request");

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleBadRequest(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody().getErrorCode()).isEqualTo("BAD_REQUEST");
            assertThat(response.getBody().getMessage()).isEqualTo("Invalid request");
        }
    }

    @Nested
    @DisplayName("Unauthorized Handler")
    class UnauthorizedHandler {

        @Test
        @DisplayName("Should return 401 with error message")
        void shouldHandleUnauthorized() {
            UnauthorizedException ex = new UnauthorizedException("Access denied");

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleUnauthorized(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
            assertThat(response.getBody().getErrorCode()).isEqualTo("UNAUTHORIZED");
        }
    }

    @Nested
    @DisplayName("Bad Credentials Handler")
    class BadCredentialsHandler {

        @Test
        @DisplayName("Should return 401 for bad credentials")
        void shouldHandleBadCredentials() {
            BadCredentialsException ex = new BadCredentialsException("Bad credentials");

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleBadCredentials(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
            assertThat(response.getBody().getErrorCode()).isEqualTo("INVALID_CREDENTIALS");
            assertThat(response.getBody().getMessage()).isEqualTo("Invalid email/phone or password");
        }
    }

    @Nested
    @DisplayName("Locked Account Handler")
    class LockedAccountHandler {

        @Test
        @DisplayName("Should return 423 for locked account")
        void shouldHandleLockedAccount() {
            LockedException ex = new LockedException("Account locked");

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleLocked(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.LOCKED);
            assertThat(response.getBody().getErrorCode()).isEqualTo("ACCOUNT_LOCKED");
        }
    }

    @Nested
    @DisplayName("Duplicate Resource Handler")
    class DuplicateResourceHandler {

        @Test
        @DisplayName("Should return 409 for duplicate resource")
        void shouldHandleDuplicate() {
            DuplicateResourceException ex = new DuplicateResourceException("Email already exists");

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleDuplicateResource(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
            assertThat(response.getBody().getErrorCode()).isEqualTo("DUPLICATE_RESOURCE");
        }
    }

    @Nested
    @DisplayName("Access Denied Handler")
    class AccessDeniedHandler {

        @Test
        @DisplayName("Should return 403 for access denied")
        void shouldHandleAccessDenied() {
            AccessDeniedException ex = new AccessDeniedException("Access denied");

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleAccessDenied(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(response.getBody().getErrorCode()).isEqualTo("FORBIDDEN");
        }
    }

    @Nested
    @DisplayName("Validation Error Handler")
    class ValidationErrorHandler {

        @Test
        @DisplayName("Should return 400 with validation errors")
        void shouldHandleValidationErrors() {
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            BindingResult bindingResult = mock(BindingResult.class);

            FieldError fieldError1 = new FieldError("object", "firstName", "First name is required");
            FieldError fieldError2 = new FieldError("object", "email", "Invalid email format");

            given(ex.getBindingResult()).willReturn(bindingResult);
            given(bindingResult.getAllErrors()).willReturn(List.of(fieldError1, fieldError2));

            ResponseEntity<ApiResponse<Map<String, String>>> response = exceptionHandler.handleValidationErrors(ex);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody().getErrorCode()).isEqualTo("VALIDATION_ERROR");
            assertThat(response.getBody().getData()).hasSize(2);
            assertThat(response.getBody().getData()).containsEntry("firstName", "First name is required");
        }
    }

    @Nested
    @DisplayName("Business Exception Handler")
    class BusinessExceptionHandler {

        @Test
        @DisplayName("Should return 422 for business errors")
        void shouldHandleBusinessException() {
            BusinessException ex = new BusinessException("Business rule violated");

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleBusinessException(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
            assertThat(response.getBody().getErrorCode()).isEqualTo("BUSINESS_ERROR");
        }
    }

    @Nested
    @DisplayName("Generic Exception Handler")
    class GenericExceptionHandler {

        @Test
        @DisplayName("Should return 500 for unexpected errors")
        void shouldHandleGenericException() {
            Exception ex = new Exception("Unexpected error");

            ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleAllUncaughtException(ex, webRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(response.getBody().getErrorCode()).isEqualTo("INTERNAL_ERROR");
            assertThat(response.getBody().getMessage()).contains("unexpected error");
        }
    }
}
