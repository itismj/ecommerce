package com.mjcoder.ecommerce.service;

import com.mjcoder.ecommerce.dto.LoginRequest;
import com.mjcoder.ecommerce.dto.LoginResponse;
import com.mjcoder.ecommerce.dto.RegisterRequest;
import com.mjcoder.ecommerce.model.User;
import com.mjcoder.ecommerce.repository.UserRepository;
import com.mjcoder.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; 

    public void register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already taken");
        if(userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already registered");

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER") 
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if(userOpt.isEmpty())
            throw new RuntimeException("Invalid username or password");

        User user = userOpt.get();

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid username or password");


        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return new LoginResponse(token);
    }
}
