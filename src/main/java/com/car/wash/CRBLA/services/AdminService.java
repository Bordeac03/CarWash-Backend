package com.car.wash.CRBLA.services;


import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Order;
import com.car.wash.CRBLA.domain.Product;
import com.car.wash.CRBLA.domain.User;

public interface AdminService {
    public String getCarwash(String searchString, int pageNumber, int limit);
    public CarWash updateCarWash(CarWash carWash);
    public CarWash addCarWash(CarWash carWash);
    public Product addProduct(Product product);
    public User addUser(User user);
    public CarWash deleteCarWash(CarWash carWash);
    public String searchOrders(String searchString, int pageNumber, int limit, String orderBy, Long carWashID);
    public boolean finishOrder(Long orderID, boolean status);
    public String searchServices(String searchString, int pageNumber, int limit);
}
