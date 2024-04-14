package com.car.wash.CRBLA.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.stereotype.Service;

import com.car.wash.CRBLA.db.CoreJDBCDao;
import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Product;
import com.car.wash.CRBLA.domain.User;

@Service
public class AdminServiceImplementation extends CoreJDBCDao implements AdminService {
    
    @Override
    public CarWash addCarWash(CarWash carWash) {
        String sql = "INSERT INTO carWash (name, address, latitude, longitude, active, openTime, contact) VALUES (?, ?, ?, ?, ?, ?, ?);";
        try (
            PreparedStatement addCarWash = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
        ) {
            addCarWash.setString(1, carWash.getName());
            addCarWash.setString(2, carWash.getAddress());
            addCarWash.setDouble(3, carWash.getLatitude());
            addCarWash.setDouble(4, carWash.getLongitude());
            addCarWash.setBoolean(5, carWash.isActive());
            addCarWash.setString(6, carWash.getOpenTime());
            addCarWash.setString(7, carWash.getContact());
            addCarWash.executeUpdate();
            ResultSet rs = addCarWash.getGeneratedKeys();
            if (rs.next()){
                carWash.setId(rs.getLong(1));
            }
            System.out.println("Car wash added" + carWash.toString());
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return carWash;
    }
    
    @Override
    public Product addProduct(Product product) {
        String sql = "INSERT INTO product (name, price, description, active) VALUES (?, ?, ?, ?);";
        try (
            PreparedStatement addProduct = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
        ) {
            addProduct.setString(1, product.getName());
            addProduct.setDouble(2, product.getPrice());
            addProduct.setBoolean(3, product.isActive());
            addProduct.executeUpdate();
            ResultSet rs = addProduct.getGeneratedKeys();
            if (rs.next()){
                product.setId(rs.getLong(1));
            }
        } catch (SQLException e) {
                e.printStackTrace();
        }
        return product;
    }
    
    @Override
    public User addUser(User user) {
        String sql = "INSERT INTO user (name, email, password, phone, active) VALUES (?, ?, ?, ?, ?);";
        try (
            PreparedStatement addUser = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
        ) {
            addUser.setString(1, user.getFullName());
            addUser.setString(2, user.getEmail());
            addUser.setString(3, user.getPassword());
            addUser.setBoolean(4, user.getActive());
            addUser.executeUpdate();
            ResultSet rs = addUser.getGeneratedKeys();
            if (rs.next()){
                user.setId(rs.getLong(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }  
    
}
