package com.mjcoder.ecommerce.dto;

import com.mjcoder.ecommerce.model.CartItem;
import lombok.Data;

@Data
public class CartItemResponse {

    private Long productId;
    private String name;
    private String description;
    private double price;
    private int quantity;
    private String imageUrl;

    // A constructor to easily convert from a CartItem entity
    public CartItemResponse(CartItem cartItem) {
        this.productId = cartItem.getProduct().getId();
        this.name = cartItem.getProduct().getName();
        this.description = cartItem.getProduct().getDescription();
        this.price = cartItem.getProduct().getPrice();
        this.quantity = cartItem.getQuantity();
        this.imageUrl = cartItem.getProduct().getImageUrl();
    }
}