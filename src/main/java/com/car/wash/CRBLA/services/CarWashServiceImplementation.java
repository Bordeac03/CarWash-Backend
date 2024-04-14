package com.car.wash.CRBLA.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.car.wash.CRBLA.db.CoreJDBCDao;
import com.car.wash.CRBLA.domain.CarWash;
import com.car.wash.CRBLA.domain.Order;

@Service
public class CarWashServiceImplementation extends CoreJDBCDao implements CarWashService {

    @Override
    public List<CarWash> findAll() {
        List<CarWash> carWashes = new ArrayList<>();
        String sql = "SELECT * FROM carWash;";
        try (
                PreparedStatement findAll = connection.prepareStatement(sql);
        ) {
            ResultSet rs = findAll.executeQuery();
            while (rs.next()){
                CarWash cw = new CarWash(rs.getLong("ID"), rs.getString("name"), rs.getString("address"), rs.getDouble("latitude"), rs.getDouble("longitude"), rs.getBoolean("active"), rs.getString("openTime"), rs.getString("contact"));
                carWashes.add(cw);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return carWashes;
    }

    @Override
    public List<Order> findOrdersByCarWashId(Long id) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders WHERE carWashID = ?;";
        try (
                PreparedStatement findOrders = connection.prepareStatement(sql);
        ) {
            findOrders.setLong(1, id);
            ResultSet rs = findOrders.executeQuery();
            while (rs.next()){
                Order o = new Order(rs.getLong("ID"), rs.getLong("userID"), rs.getLong("carWashID"), rs.getLong("serviceID"), rs.getInt("ts"), rs.getBoolean("closeBy"), rs.getBoolean("active"));
                orders.add(o);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    @Override
    public Order saveOrder(Order order) {
        String sql = "INSERT INTO booking (userID, carWashID, serviceID) VALUES (?, ?, ?);";
        try (
                PreparedStatement saveOrder = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
        ) {
            saveOrder.setLong(1, order.getUserID());
            saveOrder.setLong(2, order.getCarWashID());
            saveOrder.setLong(3, order.getServiceID());
            saveOrder.executeUpdate();
            var generatedKeys = saveOrder.getGeneratedKeys();
            if (generatedKeys.next()) {
                order.setId(generatedKeys.getLong(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        sql = "SELECT UNIX_TIMESTAMP(ts), active, closeBy FROM booking WHERE ID = ? LIMIT 1;";
        try (
                PreparedStatement saveOrder = connection.prepareStatement(sql);
        ) {
            saveOrder.setLong(1, order.getUserID());
            ResultSet rs = saveOrder.executeQuery();
            if (rs.next()) {
                order.setTs(rs.getInt("ts"));
                order.setActive(rs.getBoolean("active"));
                order.setCloseBy(rs.getBoolean("closeBy"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return order;
    }

    @Override
    public void updateOrder(Order order) {
        String sql = "UPDATE booking SET closeBy = ? WHERE ID = ?;";
        try (
                PreparedStatement updateOrder = connection.prepareStatement(sql);
        ) {
            updateOrder.setBoolean(1, order.getCloseBy());
            updateOrder.setLong(2, order.getId());
            updateOrder.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<Order> findOrdersActiveByUserId(Long id) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM booking WHERE userID = ? AND active = 1;";
        try (
                PreparedStatement findOrder = connection.prepareStatement(sql);
        ) {
            findOrder.setLong(1, id);
            ResultSet rs = findOrder.executeQuery();
            while (rs.next()){
                Order o = new Order(rs.getLong("ID"), rs.getLong("userID"), rs.getLong("carWashID"), rs.getLong("serviceID"), rs.getInt("ts"), rs.getBoolean("closeBy"), rs.getBoolean("active"));
                orders.add(o);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }
}
