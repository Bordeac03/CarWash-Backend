package com.car.wash.CRBLA.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Order;
import com.car.wash.CRBLA.services.CarWashService;
import com.car.wash.CRBLA.services.UserService;

@RestController
@RequestMapping("/carwash")
public class CarWashController {

    private final CarWashService carWashService;
    private final UserService userService;

    public CarWashController(CarWashService carWashService, UserService userService) {
        this.carWashService = carWashService;
        this.userService = userService;
    }

    @GetMapping("/order")
    @ResponseBody
    public ResponseEntity<String> getAllOrders() {
        Long userID = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CarWash cw = carWashService.findCarWasheByUserId(userID);
        List<Order> orders = carWashService.findOrdersByCarWashId(cw.getId());
        String result = "{\"orders\": [";
        for (Order order : orders) {
            result += order.toStringFull(carWashService.findServiceById(order.getServiceID()),
                    userService.findById(order.getUserID())) + ",";
        }
        result = result.substring(0, result.length() - 1) + "]}";
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PatchMapping("/order")
    @ResponseBody
    public ResponseEntity<String> patchOrder(@RequestBody Map<String, String> params) {
        Long userID = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long cwID = carWashService.findCarWasheByUserId(userID).getId();
        Long orderID = Long.parseLong(params.get("orderID"));
        Order order = carWashService.findOrderById(orderID);
        if (order.getCarWashID() != cwID) {
           return new ResponseEntity<>("{}", HttpStatus.BAD_REQUEST);
        }
        order.setCloseBy(true);
        order.setActive(false);
        carWashService.updateOrder(order);
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

}
