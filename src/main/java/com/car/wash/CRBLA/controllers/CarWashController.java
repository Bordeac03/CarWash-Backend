package com.car.wash.CRBLA.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/carwash")
public class CarWashController {

    @GetMapping("/order")
    @ResponseBody
    public ResponseEntity<String> getAll(){
        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }

    @PatchMapping("/order")
    @ResponseBody
    public ResponseEntity<String> patchOrder(){
        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }

}
