package com.ecom.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
public class LoggingInterceptor implements HandlerInterceptor {

    private static final String START_TIME_ATTR = "requestStartTime";
    private static final String REQUEST_ID_ATTR = "requestId";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) {
        String requestId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        request.setAttribute(REQUEST_ID_ATTR, requestId);
        request.setAttribute(START_TIME_ATTR, Instant.now());

        MDC.put("requestId", requestId);
        MDC.put("method", request.getMethod());
        MDC.put("path", request.getRequestURI());

        log.info("[{}] → {} {} from {}",
                requestId,
                request.getMethod(),
                request.getRequestURI(),
                request.getRemoteAddr());

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) {
        // No-op
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        String requestId = (String) request.getAttribute(REQUEST_ID_ATTR);
        Instant startTime = (Instant) request.getAttribute(START_TIME_ATTR);
        long duration = startTime != null
                ? java.time.Duration.between(startTime, Instant.now()).toMillis()
                : 0;

        int status = response.getStatus();

        if (ex != null) {
            log.error("[{}] ← {} {} {} ({}ms) - Error: {}",
                    requestId, status, request.getMethod(),
                    request.getRequestURI(), duration, ex.getMessage());
        } else if (status >= 500) {
            log.error("[{}] ← {} {} {} ({}ms)",
                    requestId, status, request.getMethod(),
                    request.getRequestURI(), duration);
        } else if (status >= 400) {
            log.warn("[{}] ← {} {} {} ({}ms)",
                    requestId, status, request.getMethod(),
                    request.getRequestURI(), duration);
        } else {
            log.info("[{}] ← {} {} {} ({}ms)",
                    requestId, status, request.getMethod(),
                    request.getRequestURI(), duration);
        }

        MDC.clear();
    }
}
