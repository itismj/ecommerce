package com.mjcoder.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final Path rootLocation = Paths.get("uploads");

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Only Admins can upload
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            // Create the 'uploads' directory if it doesn't exist
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }

            // Generate a unique filename to prevent overwrites
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save the file to the 'uploads' directory
            Files.copy(file.getInputStream(), this.rootLocation.resolve(uniqueFilename));

            // Build the public URL for the file
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/")
                    .path(uniqueFilename)
                    .toUriString();

            return ResponseEntity.ok().body(java.util.Collections.singletonMap("url", fileUrl));

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}