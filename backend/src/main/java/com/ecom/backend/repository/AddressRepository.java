package com.ecom.backend.repository;

import com.ecom.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(Long userId);

    Optional<Address> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    long countByUserIdAndIsDeletedFalse(Long userId);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId AND a.isDeleted = false")
    void clearDefaultAddresses(@Param("userId") Long userId);

    @Query("SELECT a FROM Address a WHERE a.user.id = :userId AND a.isDefault = true AND a.isDeleted = false")
    Optional<Address> findDefaultByUserId(@Param("userId") Long userId);
}
