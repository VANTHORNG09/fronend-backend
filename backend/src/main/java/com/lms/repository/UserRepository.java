package com.lms.repository;

import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmailIgnoreCaseAndDeletedAtIsNull(String email);
    boolean existsByEmailIgnoreCase(String email);
    long countByRole(Role role);
    long countByStatus(UserStatus status);

    @Query("""
        select u from User u
        where u.deletedAt is null
          and (:role is null or u.role = :role)
          and (:status is null or u.status = :status)
          and (:search is null or lower(concat(u.firstName, ' ', u.lastName, ' ', u.email)) like lower(concat('%', :search, '%')))
        """)
    Page<User> search(Role role, UserStatus status, String search, Pageable pageable);
}

