package com.carrental.controller;

import com.carrental.dto.AuthResponse;
import com.carrental.dto.LoginRequest;
import com.carrental.dto.RegisterRequest;
import com.carrental.service.RateLimitService;
import com.carrental.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private RateLimitService rateLimitService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIP(httpRequest);
        
        // Rate limit registration attempts
        if (rateLimitService.isBlocked(ip, null)) {
            long secondsRemaining = rateLimitService.getBlockedSecondsRemaining(ip, null);
            return ResponseEntity.status(429).body(
                    "Too many attempts. Please try again in " + (secondsRemaining / 60 + 1) + " minutes.");
        }
        
        try {
            AuthResponse response = userService.register(request);
            rateLimitService.recordSuccessfulAttempt(ip, request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            rateLimitService.recordFailedAttempt(ip, null);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIP(httpRequest);
        String email = request.getEmail();
        
        // Check if blocked
        if (rateLimitService.isBlocked(ip, email)) {
            long secondsRemaining = rateLimitService.getBlockedSecondsRemaining(ip, email);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Too many failed attempts");
            errorResponse.put("message", "Account temporarily locked. Please try again in " + 
                    (secondsRemaining / 60 + 1) + " minutes.");
            errorResponse.put("retryAfterSeconds", secondsRemaining);
            return ResponseEntity.status(429).body(errorResponse);
        }
        
        try {
            AuthResponse response = userService.login(request);
            rateLimitService.recordSuccessfulAttempt(ip, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            rateLimitService.recordFailedAttempt(ip, email);
            int remaining = rateLimitService.getRemainingAttempts(ip, email);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid email or password");
            if (remaining <= 3) {
                errorResponse.put("attemptsRemaining", remaining);
                errorResponse.put("message", "Invalid credentials. " + remaining + " attempts remaining.");
            }
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
