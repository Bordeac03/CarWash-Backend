package com.car.wash.CRBLA.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.car.wash.CRBLA.db.CoreJDBCDao;
import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Order;
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

    public boolean carWashExists(Long ID) {
        String sql = "SELECT 1 FROM carWash WHERE id = ?;";
        try(PreparedStatement stmt = connection.prepareStatement(sql)) {

            stmt.setLong(1, ID);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }

        } catch(SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean orderExists(Long ID) {
        String sql = "SELECT 1 FROM bookings WHERE id = ?;";
        try(PreparedStatement stmt = connection.prepareStatement(sql)) {

            stmt.setLong(1, ID);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }

        } catch(SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean serviceExists(Long ID) {
        String sql = "SELECT 1 FROM carWashService WHERE id = ?;";
        try(PreparedStatement stmt = connection.prepareStatement(sql)) {

            stmt.setLong(1, ID);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }

        } catch(SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public CarWash updateCarWash(CarWash carWash) {
        StringBuilder sql = new StringBuilder("UPDATE carWash SET ");

        List<Object> parameters = new ArrayList<>();
        if (carWash.getName() != null) {
            sql.append("name = ?, ");
            parameters.add(carWash.getName());
        }
        if (carWash.getAddress() != null) {
            sql.append("address = ?, ");
            parameters.add(carWash.getAddress());
        }
        if (carWash.getLatitude() != 0) {
            sql.append("latitude = ?, ");
            parameters.add(carWash.getLatitude());
        }
        if (carWash.getLongitude() != 0) {
            sql.append("longitude = ?, ");
            parameters.add(carWash.getLongitude());
        }
        if (carWash.isActive() != false) {
            sql.append("active = ?, ");
            parameters.add(carWash.isActive());
        }
        if (carWash.getOpenTime() != null) {
            sql.append("openTime = ?, ");
            parameters.add(carWash.getOpenTime());
        }
        if (carWash.getContact() != null) {
            sql.append("contact = ?, ");
            parameters.add(carWash.getContact());
        }
        sql.deleteCharAt(sql.length() - 2);
        sql.append(" WHERE id = ?;");
        if(!carWashExists(carWash.getId())) {
            throw new IllegalArgumentException("CarWash with given ID does not exist!");
        } else {
            parameters.add(carWash.getId());
        }

        try (
            PreparedStatement updateCarWash = connection.prepareStatement(sql.toString());
        ) {
            for (int i = 0; i < parameters.size(); i++) {
                updateCarWash.setObject(i + 1, parameters.get(i));
            }
            updateCarWash.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }  
        return carWash;

    }

    @Override
    public CarWash deleteCarWash(CarWash carWash) {
        String deleteServiceSql = "DELETE FROM carWashService WHERE carWashId = ?;";
        String deleteCarWashSql = "DELETE FROM carWash WHERE id = ?;";

        try (
            PreparedStatement deleteServicesStmt = connection.prepareStatement(deleteServiceSql);
            PreparedStatement deleteCarWashStmt = connection.prepareStatement(deleteCarWashSql);
        ) {
            if(!carWashExists(carWash.getId())) {
                throw new IllegalArgumentException("CarWash with given ID does not exist!");
            } else {
                deleteServicesStmt.setLong(1, carWash.getId());
                deleteServicesStmt.executeUpdate();

                deleteCarWashStmt.setLong(1, carWash.getId());
                deleteCarWashStmt.executeUpdate();
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return carWash;
    }

    @Override
    public String searchOrders(String searchString, int pageNumber, int limit, String orderBy, Long carWashID) {
        ArrayList<Order> orderList = new ArrayList<Order>();
        int total = 0;
        String sql = "SELECT bookings.*, users.username FROM bookings " +
                    "LEFT JOIN users ON bookings.userID = users.id " +
                    "WHERE (bookings.booking_name LIKE ? OR users.username LIKE ?) " +
                    "AND bookings.carWashID = ? " +
                    "ORDER BY " + orderBy + " " +
                    "LIMIT ? OFFSET ?";
        String countSql = "SELECT COUNT(*) FROM bookings WHERE booking_name LIKE ? OR userID IN (SELECT id FROM users WHERE username LIKE ?);";

        try (
            PreparedStatement searchBookings = connection.prepareStatement(sql);
            PreparedStatement getCount = connection.prepareStatement(countSql);
        ) {
            if(!carWashExists(carWashID)) {
                throw new IllegalArgumentException("CarWash with given ID does not exist!");
            }

            searchBookings.setString(1, "%" + searchString + "%");
            searchBookings.setString(2, "%" + searchString + "%");
            searchBookings.setInt(3, carWashID.intValue());
            searchBookings.setInt(3, limit);
            searchBookings.setInt(4, (pageNumber - 1) * limit);
            ResultSet rs = searchBookings.executeQuery();

            getCount.setString(1, "%" + searchString + "%");
            getCount.setString(2, "%" + searchString + "%");
            ResultSet countRs = getCount.executeQuery();

            if(countRs.next()) {
                total = countRs.getInt(1);
            }

            while (rs.next()) {
                Order order = new Order();
                order.setId(rs.getLong("id"));
                order.setUserID(rs.getLong("userID"));
                order.setCarWashID(rs.getLong("carWashID"));
                order.setServiceID(rs.getLong("serviceID"));
                order.setTs(rs.getInt("ts"));
                order.setCloseBy(rs.getBoolean("closeBy"));
                order.setActive(rs.getBoolean("active"));
                orderList.add(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", orderList);
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

    @Override
    public boolean finishOrder(Long orderID, boolean status) {
        String sql = "UPDATE bookings SET active = ? WHERE id = ?;";
        try (
            PreparedStatement finishOrder = connection.prepareStatement(sql);
        ) {
            finishOrder.setBoolean(1, true);

            if(!orderExists(orderID)) {
                throw new IllegalArgumentException("Order with given ID does not exist!");
            } else {
                finishOrder.setLong(2, orderID);
            }

            int rowsUpdated = finishOrder.executeUpdate();

            if(rowsUpdated > 0) {
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public String searchServices(String searchString, Long carwashID, int pageNumber, int limit) {
        ArrayList<Product> productList = new ArrayList<Product>();
        int total = 0;
        String sql = "SELECT * FROM carWashService WHERE name LIKE ? AND carWashID = ? LIMIT ?,?;";
        String countSql = "SELECT COUNT(*) FROM carWashService WHERE name LIKE ?;";

        try (
            PreparedStatement searchServices = connection.prepareStatement(sql);
            PreparedStatement getCount = connection.prepareStatement(countSql);
        ) {
            searchServices.setString(1, "%" + searchString + "%");

            if(!carWashExists(carwashID)) {
                throw new IllegalArgumentException("CarWash with given ID does not exist!");
            } else {
                searchServices.setLong(2, carwashID);
            }

            searchServices.setInt(3, (pageNumber - 1) * limit);
            searchServices.setInt(4, limit);
            ResultSet rs = searchServices.executeQuery();

            getCount.setString(1, "%" + searchString + "%");
            ResultSet countRs = getCount.executeQuery();

            if(countRs.next()) {
                total = countRs.getInt(1);
            }

            while (rs.next()) {
                Product product = new Product();
                product.setId(rs.getLong("id"));
                product.setName(rs.getString("name"));
                product.setPrice(rs.getDouble("price"));
                product.setActive(rs.getBoolean("active"));
                productList.add(product);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", productList);
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

    @Override
    public Product addService(Product product) {
        String sql = "INSERT INTO carWashService (name, carWashID, price, active) VALUES (?, ?, ?, ?);";
        try (
            PreparedStatement addService = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
        ) {
            addService.setString(1, product.getName());

            if(!carWashExists(product.getCarWashID())) {
                throw new IllegalArgumentException("CarWash with given ID does not exist!");
            } else {
                addService.setLong(2, product.getCarWashID());
            }
            
            addService.setDouble(3, product.getPrice());
            addService.setBoolean(4, product.isActive());
            addService.executeUpdate();
            ResultSet rs = addService.getGeneratedKeys();
            if (rs.next()){
                product.setId(rs.getLong(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return product;
    }

    @Override
    public Product updateService(Product product) {
        StringBuilder sql = new StringBuilder("UPDATE carWashService SET ");

        List<Object> parameters = new ArrayList<>();
        if (product.getName() != null) {
            sql.append("name = ?, ");
            parameters.add(product.getName());
        }
        if (product.getCarWashID() != null) {
            if(!carWashExists(product.getCarWashID())) {
                throw new IllegalArgumentException("CarWash with given ID does not exist!");
            } else {
                sql.append("carWashID = ?, ");
                parameters.add(product.getCarWashID());
            }
        }
        if (product.getPrice() != 0) {
            sql.append("price = ?, ");
            parameters.add(product.getPrice());
        }
        if (product.isActive() != false || product.isActive() != true){
            sql.append("active = ?, ");
            parameters.add(product.isActive());
        }
        sql.deleteCharAt(sql.length() - 2);
        sql.append(" WHERE id = ?;");
        if(!serviceExists(product.getId())) {
            throw new IllegalArgumentException("Service with given ID does not exist!");
        } else {
            parameters.add(product.getId());
        }

        try (
            PreparedStatement updateService = connection.prepareStatement(sql.toString());
        ) {
            for (int i = 0; i < parameters.size(); i++) {
                updateService.setObject(i + 1, parameters.get(i));
            }
            updateService.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return product;
    }

    @Override
    public Product deleteService(Product product) {
        String sql = "DELETE FROM carWashService WHERE id = ?;";
        try (
            PreparedStatement deleteService = connection.prepareStatement(sql);
        ) {
            if(!serviceExists(product.getId())) {
                throw new IllegalArgumentException("Service with given ID does not exist!");
            } else {
                deleteService.setLong(1, product.getId());
            }
            deleteService.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return product;
    }
}
