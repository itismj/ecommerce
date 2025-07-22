package com.mjcoder.ecommerce.service;

import com.mjcoder.ecommerce.model.Product;
import com.mjcoder.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mjcoder.ecommerce.repository.CartItemRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    public Product addProduct(Product product) {

        if (product.getQuantity() == 0) {
            product.setQuantity(1);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProductDetails) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        Optional.ofNullable(updatedProductDetails.getName()).ifPresent(existingProduct::setName);
        Optional.ofNullable(updatedProductDetails.getDescription()).ifPresent(existingProduct::setDescription);
        Optional.ofNullable(updatedProductDetails.getImageUrl()).ifPresent(existingProduct::setImageUrl);

        if (updatedProductDetails.getPrice() > 0) {
            existingProduct.setPrice(updatedProductDetails.getPrice());
        }
        
        if (updatedProductDetails.getQuantity() >= 0) {
            existingProduct.setQuantity(updatedProductDetails.getQuantity());
        }


        return productRepository.save(existingProduct);
    }

    @Transactional 
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        cartItemRepository.deleteByProduct(product);

        productRepository.delete(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}