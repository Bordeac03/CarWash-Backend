package com.car.wash.CRBLA.controllers;

import java.util.ArrayList;
import java.util.HashMap;
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

import com.car.wash.CRBLA.domain.Order;
import com.car.wash.CRBLA.domain.Product;
import com.car.wash.CRBLA.services.CarWashService;

@RestController
@RequestMapping("/client")
public class ClientController {

    private final CarWashService carWashService;

    public ClientController(CarWashService carWashService) {
        this.carWashService = carWashService;
    }

    @GetMapping("/carwash")
    @ResponseBody
    public ResponseEntity<String> carwashAll() {
        ArrayList<String> carWashes = new ArrayList<>();
        carWashService.findAll().forEach(carWash -> carWashes.add(carWash.toString()));
        return new ResponseEntity<>(carWashes.toString(), HttpStatus.OK);
    }

    @GetMapping("/service")
    @ResponseBody
    public ResponseEntity<String> service(@RequestBody Map<String,String> params) {
        Long carWashID = Long.parseLong(params.get("carWashID"));
        ArrayList<Product> services = new ArrayList<>();
        carWashService.findServicesByCarWashId(carWashID).forEach(service -> services.add(service));
        return new ResponseEntity<>(services.toString(), HttpStatus.OK);
    }
    
    @PostMapping("/order")
    @ResponseBody
    public ResponseEntity<String> postOrder(@RequestBody Map<String,String> params) {
        Long userID = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long carWashID = Long.parseLong(params.get("carWashID"));
        ArrayList<Long> services = new ArrayList<>();
        params.forEach((key, value) -> {
            if (key.contains("service")) {
                services.add(Long.parseLong(value));
            }
        });
        services.forEach(service -> {
            carWashService.saveOrder(new Order(null, userID, carWashID, service, 0, false, true));
        });
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

    @PatchMapping("/order")
    @ResponseBody
    public ResponseEntity<String> patchOrder() {
        Long userID = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Order> orders = carWashService.findOrdersActiveByUserId(userID);
        orders.forEach(order -> {
            order.setCloseBy(true);
            carWashService.updateOrder(order);
        });
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

}
