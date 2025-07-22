package com.mjcoder.ecommerce.repository;

import com.mjcoder.ecommerce.model.CartItem;
import com.mjcoder.ecommerce.model.Product;
import com.mjcoder.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, com.mjcoder.ecommerce.model.Product product);
    void deleteByProduct(Product product);
}