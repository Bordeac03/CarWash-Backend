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
import org.springframework.web.bind.annotation.DeleteMapping;
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
 // (entity.get("carWashID") != null) ? Long.parseLong(entity.get("carWashID")) : null
    @PatchMapping("/carwash")
    @ResponseBody
    public ResponseEntity<String> updateCarWash(@RequestBody Map<String, String> entity) {
        CarWash newCarWash = new CarWash();
        newCarWash.setId(Long.parseLong(entity.get("id")));
        newCarWash.setName(entity.get("name"));
        newCarWash.setAddress(entity.get("address"));
        if(entity.get("latitude") != null) {
            newCarWash.setLatitude(Double.parseDouble(entity.get("latitude")));
        }
        if(entity.get("longitude") != null) {
            newCarWash.setLongitude(Double.parseDouble(entity.get("longitude")));
        }
        newCarWash.setActive(Boolean.parseBoolean(entity.get("active")));
        newCarWash.setOpenTime(entity.get("openTime"));
        newCarWash.setContact(entity.get("contact"));

        return new ResponseEntity<>(adminService.updateCarWash(newCarWash).toString(), HttpStatus.OK);
    }

    @DeleteMapping("/carwash")
    @ResponseBody
    public ResponseEntity<String> deleteCarWash(@RequestBody Map<String, String> entity) {
        CarWash newCarWash = new CarWash();
        newCarWash.setId(Long.parseLong(entity.get("id")));
        adminService.deleteCarWash(newCarWash);
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

    // TESTING NEEDED
    @GetMapping("/carwash/orders")
    @ResponseBody
    public ResponseEntity<String> searchOrders(@RequestParam String searchString, @RequestParam int pageNumber, @RequestParam int limit, @RequestParam String orderBy, @RequestParam Long carWashID) {
        return new ResponseEntity<>(adminService.searchOrders(searchString, pageNumber, limit, orderBy, carWashID), HttpStatus.OK);
    }

    // TESTING NEEDED
    @PatchMapping("/carwash/orders")
    @ResponseBody
    public ResponseEntity<String> finishOrder(@RequestBody Map<String, String> entity) {
        adminService.finishOrder(Long.parseLong(entity.get("orderID")), Boolean.parseBoolean(entity.get("status")));
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

    @GetMapping("/carwash/services")
    @ResponseBody
    public ResponseEntity<String> searchServices(@RequestParam String searchString, @RequestParam Long carWashID, @RequestParam int pageNumber, @RequestParam int limit) {
        return new ResponseEntity<>(adminService.searchServices(searchString, carWashID, pageNumber, limit), HttpStatus.OK);
    }

    @PostMapping("/carwash/services")
    @ResponseBody
    public ResponseEntity<String> addService(@RequestBody Map<String, String> entity) {
        Product newProduct = new Product();
        newProduct.setName(entity.get("name"));
        newProduct.setCarWashID(Long.parseLong(entity.get("carWashID")));
        newProduct.setPrice(Double.parseDouble(entity.get("price")));
        newProduct.setActive(Boolean.parseBoolean(entity.get("active")));
        adminService.addService(newProduct);

        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

    @PatchMapping("/carwash/services")
    @ResponseBody
    public ResponseEntity<String> updateService(@RequestBody Map<String, String> entity) {
        Product newProduct = new Product();

        newProduct.setId(Long.parseLong(entity.get("id")));
        newProduct.setName(entity.get("name"));
        newProduct.setCarWashID((entity.get("carWashID") != null) ? Long.parseLong(entity.get("carWashID")) : null);
        newProduct.setPrice(entity.get("price") == null ? null : Double.parseDouble(entity.get("price")));
        newProduct.setActive(Boolean.parseBoolean(entity.get("active")));
        return new ResponseEntity<>(adminService.updateService(newProduct).toString(), HttpStatus.OK);
    }

    @DeleteMapping("/carwash/services")
    @ResponseBody
    public ResponseEntity<String> deleteService(@RequestBody Map<String, String> entity) {
        Product newProduct = new Product();
        newProduct.setId(Long.parseLong(entity.get("id")));
        adminService.deleteService(newProduct);
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }

    @GetMapping("/carwash/users")
    @ResponseBody
    public ResponseEntity<String> searchUsers(@RequestParam String searchString, @RequestParam int pageNumber, @RequestParam int limit, @RequestParam Long carWashID) {
        return new ResponseEntity<>(adminService.searchUsers(searchString, pageNumber, limit, carWashID), HttpStatus.OK);
    }
    
    @PostMapping("/carwash/users")
    @ResponseBody
    public ResponseEntity<String> addUser(@RequestBody Map<String, String> entity) {
        User newUser = new User();
        newUser.setFullName(entity.get("fullName"));
        newUser.setEmail(entity.get("email"));
        newUser.setPassword(entity.get("password"));
        newUser.setRole(entity.get("role"));
        newUser.setActive(Boolean.parseBoolean(entity.get("active")));
        return new ResponseEntity<>(adminService.addUser(newUser, Long.parseLong(entity.get("carWashID"))).toString(), HttpStatus.OK);
    }
    
    
}
