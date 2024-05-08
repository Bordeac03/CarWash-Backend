package com.car.wash.CRBLA.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String fullName;
    private String email;
    private String password;
    private String role;
    private Boolean active;

    @Override
    public String toString() {
        return "{\"ID\":\"" + id + "\",\"fullName\":\"" + fullName + "\",\"email\":\"" + email + "\",\"role\":\"" + role + "\",\"active\":\"" + active + "\"}";
    }
} 