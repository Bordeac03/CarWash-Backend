package com.car.wash.CRBLA.controllers;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<String> carwashAll(){
        ArrayList<String> carWashes = new ArrayList<>();
        carWashService.findAll().forEach(carWash -> carWashes.add(carWash.toString()));
        return new ResponseEntity<>(carWashes.toString(), HttpStatus.OK);
    }

    @PostMapping("/order")
    @ResponseBody
    public ResponseEntity<String> postOrder(){
        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }

    @PatchMapping("/order")
    @ResponseBody
    public ResponseEntity<String> patchOrder(){
        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }

}
