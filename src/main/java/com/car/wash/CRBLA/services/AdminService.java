package com.car.wash.CRBLA.services;


import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Product;
import com.car.wash.CRBLA.domain.User;

public interface AdminService {
    public String getCarwash(String searchString, int pageNumber, int limit);
    public CarWash addCarWash(CarWash carWash);
    public Product addProduct(Product product);
    public User addUser(User user);
}
