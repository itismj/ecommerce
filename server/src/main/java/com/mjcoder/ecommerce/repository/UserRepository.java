package com.mjcoder.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mjcoder.ecommerce.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}