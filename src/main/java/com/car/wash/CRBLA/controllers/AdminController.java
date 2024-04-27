package com.car.wash.CRBLA.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Product;
import com.car.wash.CRBLA.domain.User;
import com.car.wash.CRBLA.services.AdminService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/carwash")
    public ResponseEntity<String> getCarwash(@RequestParam String searchString, @RequestParam int pageNumber, @RequestParam int limit) {
        return new ResponseEntity<>(adminService.getCarwash(searchString, pageNumber, limit), HttpStatus.OK);
    }
    

    @PostMapping("/carwash")
    @ResponseBody
    public ResponseEntity<String> addCarWash(@RequestBody Map<String, String> entity) {
        CarWash newCarWash = new CarWash();
        newCarWash.setName(entity.get("name"));
        newCarWash.setAddress(entity.get("address"));
        newCarWash.setLatitude(Double.parseDouble(entity.get("latitude")));
        newCarWash.setLongitude(Double.parseDouble(entity.get("longitude")));
        newCarWash.setActive(Boolean.parseBoolean(entity.get("active")));
        newCarWash.setOpenTime(entity.get("openTime"));
        newCarWash.setContact(entity.get("contact"));
        adminService.addCarWash(newCarWash);

        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

    @PatchMapping("/carwash")
    @ResponseBody
    public ResponseEntity<String> updateCarWash(@RequestBody Map<String, String> entity) {
        CarWash newCarWash = new CarWash();
        newCarWash.setId(Long.parseLong(entity.get("id")));
        newCarWash.setName(entity.get("name"));
        newCarWash.setAddress(entity.get("address"));
        newCarWash.setLatitude(Double.parseDouble(entity.get("latitude")));
        newCarWash.setLongitude(Double.parseDouble(entity.get("longitude")));
        newCarWash.setActive(Boolean.parseBoolean(entity.get("active")));
        newCarWash.setOpenTime(entity.get("openTime"));
        newCarWash.setContact(entity.get("contact"));

        return new ResponseEntity<>(adminService.updateCarWash(newCarWash).toString(), HttpStatus.OK);
    }

    @PostMapping("/addProduct")
    @ResponseBody
    public ResponseEntity<String> addProduct(@RequestBody Map<String, String> entity) {
        Product newProduct = new Product();
        newProduct.setName(entity.get("name"));
        newProduct.setPrice(Double.parseDouble(entity.get("price")));
        newProduct.setActive(Boolean.parseBoolean(entity.get("active")));
        adminService.addProduct(newProduct);

        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

    @PostMapping("/addUser")
    @ResponseBody
    public ResponseEntity<String> addUser(@RequestBody Map<String, String> entity) {
        User newUser = new User();

        newUser.setFullName(entity.get("fullName"));
        newUser.setEmail(entity.get("email"));
        newUser.setPassword(entity.get("password"));
        newUser.setRole(entity.get("role"));
        newUser.setActive(Boolean.parseBoolean(entity.get("active")));

        adminService.addUser(newUser);
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }
    
    
}
