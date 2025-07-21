package com.mjcoder.ecommerce.controller;

import com.mjcoder.ecommerce.dto.CartRequest;
import com.mjcoder.ecommerce.model.CartItem;
import com.mjcoder.ecommerce.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('USER')")
public class CartController {

    @Autowired
    private CartItemService cartItemService;

    // Get cart items for current user
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cartItemService.getUserCart(username));
    }

    // Add product to cart
    @PostMapping
    public ResponseEntity<Void> addToCart(@RequestBody CartRequest request, Authentication authentication) {
        String username = authentication.getName();
        cartItemService.addToCart(username, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok().build();
    }

    // Remove product from cart
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long productId, Authentication authentication) {
        String username = authentication.getName();
        cartItemService.removeFromCart(username, productId);
        return ResponseEntity.ok().build();
    }
}
