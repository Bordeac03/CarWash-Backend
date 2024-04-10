package com.car.wash.CRBLA.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.car.wash.CRBLA.config.JwtSecured;

@RestController
@RequestMapping("/")
public class ClientUserController {

    @GetMapping("/test")
    @JwtSecured
    @ResponseBody
    public ResponseEntity<String> test(){

        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }

    @GetMapping("/")
    @ResponseBody
    public ResponseEntity<String> home(){

        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }
}
