package com.car.wash.CRBLA.config;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            JwtSecured jwtSecured = handlerMethod.getMethodAnnotation(JwtSecured.class);
            if (jwtSecured != null) {
                // JWT verification logic goes here
                String token = request.getHeader("Authorization");
                if (token == null || !verifyToken(token)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return false;
                }
            }
        }
        return true;
    }

    private boolean verifyToken(String token) {
        // Implement your JWT verification logic here
        return true;
    }
}