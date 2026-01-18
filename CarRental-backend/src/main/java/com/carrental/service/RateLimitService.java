package com.carrental.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitService.class);
    
    // Configuration
    private static final int MAX_ATTEMPTS = 5;
    private static final int BLOCK_DURATION_MINUTES = 15;
    private static final int ATTEMPT_WINDOW_MINUTES = 15;

    // Track failed attempts by IP and email
    private final Map<String, AttemptInfo> ipAttempts = new ConcurrentHashMap<>();
    private final Map<String, AttemptInfo> emailAttempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String ip, String email) {
        boolean ipBlocked = isKeyBlocked(ip, ipAttempts);
        boolean emailBlocked = email != null && isKeyBlocked(email, emailAttempts);
        
        if (ipBlocked) {
            logger.warn("Blocked request from IP: {}", ip);
        }
        if (emailBlocked) {
            logger.warn("Blocked request for email: {}", email);
        }
        
        return ipBlocked || emailBlocked;
    }

    public void recordFailedAttempt(String ip, String email) {
        recordAttempt(ip, ipAttempts);
        if (email != null) {
            recordAttempt(email, emailAttempts);
        }
        logger.info("Failed login attempt recorded - IP: {}, Email: {}", ip, email);
    }

    public void recordSuccessfulAttempt(String ip, String email) {
        // Clear attempts on successful login
        ipAttempts.remove(ip);
        if (email != null) {
            emailAttempts.remove(email);
        }
    }

    public int getRemainingAttempts(String ip, String email) {
        int ipRemaining = getRemainingForKey(ip, ipAttempts);
        int emailRemaining = email != null ? getRemainingForKey(email, emailAttempts) : MAX_ATTEMPTS;
        return Math.min(ipRemaining, emailRemaining);
    }

    public long getBlockedSecondsRemaining(String ip, String email) {
        long ipSeconds = getBlockedSecondsForKey(ip, ipAttempts);
        long emailSeconds = email != null ? getBlockedSecondsForKey(email, emailAttempts) : 0;
        return Math.max(ipSeconds, emailSeconds);
    }

    private boolean isKeyBlocked(String key, Map<String, AttemptInfo> attempts) {
        AttemptInfo info = attempts.get(key);
        if (info == null) {
            return false;
        }

        // Clean up old attempts
        if (info.windowExpiry.isBefore(LocalDateTime.now())) {
            attempts.remove(key);
            return false;
        }

        // Check if blocked
        if (info.blockedUntil != null && info.blockedUntil.isAfter(LocalDateTime.now())) {
            return true;
        }

        return false;
    }

    private void recordAttempt(String key, Map<String, AttemptInfo> attempts) {
        AttemptInfo info = attempts.computeIfAbsent(key, k -> new AttemptInfo());
        LocalDateTime now = LocalDateTime.now();

        // Reset if window expired
        if (info.windowExpiry.isBefore(now)) {
            info.attemptCount = 0;
            info.windowExpiry = now.plusMinutes(ATTEMPT_WINDOW_MINUTES);
            info.blockedUntil = null;
        }

        info.attemptCount++;

        // Block if too many attempts
        if (info.attemptCount >= MAX_ATTEMPTS) {
            info.blockedUntil = now.plusMinutes(BLOCK_DURATION_MINUTES);
            logger.warn("Key blocked due to too many failed attempts: {}", key);
        }
    }

    private int getRemainingForKey(String key, Map<String, AttemptInfo> attempts) {
        AttemptInfo info = attempts.get(key);
        if (info == null || info.windowExpiry.isBefore(LocalDateTime.now())) {
            return MAX_ATTEMPTS;
        }
        return Math.max(0, MAX_ATTEMPTS - info.attemptCount);
    }

    private long getBlockedSecondsForKey(String key, Map<String, AttemptInfo> attempts) {
        AttemptInfo info = attempts.get(key);
        if (info == null || info.blockedUntil == null) {
            return 0;
        }
        LocalDateTime now = LocalDateTime.now();
        if (info.blockedUntil.isBefore(now)) {
            return 0;
        }
        return java.time.Duration.between(now, info.blockedUntil).getSeconds();
    }

    private static class AttemptInfo {
        int attemptCount = 0;
        LocalDateTime windowExpiry = LocalDateTime.now().plusMinutes(ATTEMPT_WINDOW_MINUTES);
        LocalDateTime blockedUntil = null;
    }
}
