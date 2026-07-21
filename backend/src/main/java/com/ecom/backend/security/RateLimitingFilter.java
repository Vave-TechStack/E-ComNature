package com.ecom.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
@Order(1)
public class RateLimitingFilter implements Filter {

    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    // Different rate limits per endpoint group
    private static final int AUTH_LIMIT = 5;           // 5 requests per minute for auth endpoints
    private static final int API_LIMIT = 100;          // 100 requests per minute for regular API
    private static final long WINDOW_MS = TimeUnit.MINUTES.toMillis(1);

    // Endpoint prefixes that need stricter rate limiting
    private static final String[] AUTH_PATHS = {
        "/auth/login", "/auth/register", "/auth/forgot-password",
        "/auth/reset-password", "/auth/verify-otp", "/auth/refresh",
        "/auth/otp/send", "/auth/otp/verify"
    };

    public void reset() {
        buckets.clear();
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String clientIp = getClientIp(request);
        String requestUri = request.getRequestURI();
        boolean isAuthPath = isAuthEndpoint(requestUri);

        // Use IP-based key for auth (rate limits per IP) and more granular key for API
        String key = isAuthPath
            ? "auth:" + clientIp
            : clientIp + ":" + requestUri;

        int limit = isAuthPath ? AUTH_LIMIT : API_LIMIT;

        TokenBucket bucket = buckets.computeIfAbsent(key, k ->
                new TokenBucket(limit, WINDOW_MS));

        if (bucket.tryConsume()) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json");
            String message = isAuthPath
                ? "Too many authentication attempts. Please try again later."
                : "Rate limit exceeded. Please try again later.";
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"" + message + "\",\"errorCode\":\"RATE_LIMIT_EXCEEDED\"}");
        }
    }

    private boolean isAuthEndpoint(String uri) {
        for (String path : AUTH_PATHS) {
            if (uri.contains(path)) {
                return true;
            }
        }
        return false;
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty() && !xff.equalsIgnoreCase("unknown")) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class TokenBucket {
        private final long maxTokens;
        private final long windowMs;
        private long tokens;
        private long lastRefillTime;

        public TokenBucket(long maxTokens, long windowMs) {
            this.maxTokens = maxTokens;
            this.windowMs = windowMs;
            this.tokens = maxTokens;
            this.lastRefillTime = System.currentTimeMillis();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens > 0) {
                tokens--;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long elapsed = now - lastRefillTime;
            if (elapsed > windowMs) {
                tokens = maxTokens;
                lastRefillTime = now;
            }
        }
    }
}
