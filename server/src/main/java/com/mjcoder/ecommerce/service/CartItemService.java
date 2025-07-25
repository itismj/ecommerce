package com.mjcoder.ecommerce.service;

import com.mjcoder.ecommerce.model.CartItem;
import com.mjcoder.ecommerce.model.Product;
import com.mjcoder.ecommerce.model.User;
import com.mjcoder.ecommerce.repository.CartItemRepository;
import com.mjcoder.ecommerce.repository.ProductRepository;
import com.mjcoder.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mjcoder.ecommerce.dto.CartItemResponse; 
import java.util.stream.Collectors;


import java.util.List;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItemResponse> getUserCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        // Convert each CartItem entity into a CartItemResponse DTO
        return cartItems.stream()
                .map(CartItemResponse::new) 
                .collect(Collectors.toList());
    }

    public void addToCart(String username, Long productId, int quantity) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        CartItem existing = cartItemRepository.findByUserAndProduct(user, product).orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(newItem);
        }
    }

    public void removeFromCart(String username, Long productId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartItemRepository.delete(item);
    }
}
