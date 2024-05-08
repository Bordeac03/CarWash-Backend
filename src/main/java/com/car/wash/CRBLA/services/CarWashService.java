package com.car.wash.CRBLA.services;

import java.util.List;

import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Order;
import com.car.wash.CRBLA.domain.Product;

public interface CarWashService {
    public List<CarWash> findAll();
    public List<Order> findOrdersActiveByUserId(Long id);
    public List<Order> findOrdersByCarWashId(Long id);
    public Order saveOrder(Order order);
    public void updateOrder(Order order);
    public CarWash findCarWashesByLocation(Long id);
    public List<Product> findServicesByCarWashId(Long id);
    public CarWash findCarWasheByUserId(Long userID);
    public Product findServiceById(Long id);
}
