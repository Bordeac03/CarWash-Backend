package com.car.wash.CRBLA.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<String> login() {
        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<String> register() {
        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }

    @PostMapping("/refresh")
    @ResponseBody
    public ResponseEntity<String> refresh() {
        return new ResponseEntity<>("{\"key\":\"value\"}", HttpStatus.OK);
    }
}
