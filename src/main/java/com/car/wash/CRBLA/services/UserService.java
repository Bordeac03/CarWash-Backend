package com.car.wash.CRBLA.services;

import java.util.List;

import com.car.wash.CRBLA.domain.User;

public interface UserService {
    public List<User> findAll();
    public User findById(Long id);
    public User findByEmail(String email);
    public User saveUser(User user);
    public User updateUser(User user);
}
