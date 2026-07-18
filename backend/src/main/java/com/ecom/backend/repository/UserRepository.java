package com.ecom.backend.repository;

import com.ecom.backend.entity.User;
import com.ecom.backend.entity.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndIsDeletedFalse(String email);

    Optional<User> findByPhoneAndIsDeletedFalse(String phone);

    Optional<User> findByIdAndIsDeletedFalse(Long id);

    Boolean existsByEmailAndIsDeletedFalse(String email);

    Boolean existsByPhoneAndIsDeletedFalse(String phone);

    Optional<User> findByReferralCodeAndIsDeletedFalse(String referralCode);

    Optional<User> findByGoogleIdAndIsDeletedFalse(String googleId);

    Page<User> findByRoleAndIsDeletedFalse(UserRole role, Pageable pageable);

    List<User> findByIsActiveAndIsDeletedFalse(Boolean isActive);

    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "u.phone LIKE CONCAT('%', :search, '%'))")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :start AND :end AND u.isDeleted = false")
    List<User> findUsersRegisteredBetween(@Param("start") LocalDateTime start,
                                          @Param("end") LocalDateTime end);

    long countByIsDeletedFalse();

    Page<User> findByIsDeletedFalse(Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since AND u.isDeleted = false")
    long countNewUsersSince(@Param("since") LocalDateTime since);
}
