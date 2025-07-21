package com.mjcoder.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.mjcoder.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
}