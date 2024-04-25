package com.car.wash.CRBLA.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Order;
import com.car.wash.CRBLA.services.CarWashService;

@RestController
@RequestMapping("/carwash")
public class CarWashController {

    private final CarWashService carWashService;

    public CarWashController(CarWashService carWashService) {
        this.carWashService = carWashService;
    }

    @GetMapping("/order")
    @ResponseBody
    public ResponseEntity<String> getAllOrders() {
        Long cwID = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CarWash cw = carWashService.findCarWashesByLocation(cwID);
        List<Order> orders = carWashService.findOrdersByCarWashId(cw.getId());
        return new ResponseEntity<>(orders.toString(), HttpStatus.OK);
    }

    @PatchMapping("/order")
    @ResponseBody
    public ResponseEntity<String> patchOrder(@RequestBody Map<String, String> params) {
        Long cwID = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userID = Long.parseLong(params.get("userID"));
        List<Order> orders = carWashService.findOrdersActiveByUserId(userID);
        orders.forEach(order -> {
            if (order.getCarWashID() != cwID) {
                return;
            }
            order.setCloseBy(true);
            order.setActive(false);
            carWashService.updateOrder(order);
        });
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

}
