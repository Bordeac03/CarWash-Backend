package com.car.wash.CRBLA.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.car.wash.CRBLA.db.CoreJDBCDao;
import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Product;
import com.car.wash.CRBLA.domain.User;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    @Override
    public String getCarwash(String searchString, int pageNumber, int limit) {
        ArrayList<CarWash> carWashList = new ArrayList<CarWash>();
        int total = 0;
        String sql = "SELECT * FROM carWash WHERE name LIKE ? OR address LIKE ? LIMIT ?,?;";
        String countSql = "SELECT COUNT(*) FROM carWash WHERE name LIKE ? OR address LIKE ?;";
        try (
            PreparedStatement getCount = connection.prepareStatement(countSql);
            PreparedStatement getCarWash = connection.prepareStatement(sql);
        ) {
            getCount.setString(1, "%" + searchString + "%");
            getCount.setString(2, "%" + searchString + "%");
            ResultSet countRs = getCount.executeQuery();
            if(countRs.next()) {
                total = countRs.getInt(1);
            }

            getCarWash.setString(1, "%" + searchString + "%");
            getCarWash.setString(2, "%" + searchString + "%");
            getCarWash.setInt(3, (pageNumber - 1) * limit);
            getCarWash.setInt(4, limit);
            ResultSet rs = getCarWash.executeQuery();
            while (rs.next()) {
                CarWash carWash = new CarWash();
                carWash.setId(rs.getLong("id"));
                carWash.setName(rs.getString("name"));
                carWash.setAddress(rs.getString("address"));
                carWash.setLatitude(rs.getDouble("latitude"));
                carWash.setLongitude(rs.getDouble("longitude"));
                carWash.setActive(rs.getBoolean("active"));
                carWash.setOpenTime(rs.getString("openTime"));
                carWash.setContact(rs.getString("contact"));
                carWashList.add(carWash);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", carWashList);
        response.put("total", total);

        ObjectMapper mapper = new ObjectMapper();
        String json = "";
        try {
            json = mapper.writeValueAsString(response);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return json;
    }  
    
}
