package com.car.wash.CRBLA.config;



import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.car.wash.CRBLA.db.CoreJDBCDao;

import jakarta.annotation.PostConstruct;

@Configuration
public class WebConfig extends CoreJDBCDao implements WebMvcConfigurer {

    @PostConstruct
    public void init() {
        System.out.println("DB init");
        initDB();
        String createUserSQL = "CREATE TABLE IF NOT EXISTS user (ID INT NOT NULL AUTO_INCREMENT, email varchar(255) NOT NULL, password varchar(255) NOT NULL, fullName VARCHAR(255) NULL, active BOOLEAN DEFAULT 1, role varchar(10), PRIMARY KEY (ID), UNIQUE(`email`));";
        String createCarWashSQL = "CREATE TABLE IF NOT EXISTS carWash (ID INT NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, address varchar(255) NOT NULL, latitude DOUBLE(11,7) NOT NULL, longitude DOUBLE(11,7) NOT NULL, active BOOLEAN DEFAULT 1, openTime varchar(50) NOT NULL, contact varchar(300), PRIMARY KEY (ID), UNIQUE(`name`));";
        String createCarWashConfigSQL = "CREATE TABLE IF NOT EXISTS carWashConfig (ID INT NOT NULL AUTO_INCREMENT, userID INT NOT NULL, carWashID INT NOT NULL, PRIMARY KEY (ID), FOREIGN KEY (userID) REFERENCES user(ID), FOREIGN KEY (carWashID) REFERENCES carWash(ID), UNIQUE(`userID`));";
        String createCarWashServiceSQL = "CREATE TABLE IF NOT EXISTS carWashService (ID INT NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, carWashID INT NOT NULL, price DOUBLE(11,2) NOT NULL, active BOOLEAN DEFAULT 1, PRIMARY KEY (ID), FOREIGN KEY (carWashID) REFERENCES carWash(ID), UNIQUE(`userID`), UNIQUE(`name`,`carWashID`));";
        String createBookingsSQL = "CREATE TABLE IF NOT EXISTS bookings (ID INT NOT NULL AUTO_INCREMENT, userID INT NOT NULL, carWashID INT NOT NULL, serviceID INT NOT NULL, ts TIMESTAMP NOT NULL, closeBy BOOLEAN DEFAULT 0, active BOOLEAN DEFAULT 1 , PRIMARY KEY (ID), FOREIGN KEY (userID) REFERENCES user(ID), FOREIGN KEY (carWashID) REFERENCES carWash(ID), FOREIGN KEY (serviceID) REFERENCES carWashService(ID));";

        try (
                PreparedStatement query1 = connection.prepareStatement(createUserSQL);
                PreparedStatement query2 = connection.prepareStatement(createCarWashSQL);
                PreparedStatement query3 = connection.prepareStatement(createCarWashConfigSQL);
                PreparedStatement query4 = connection.prepareStatement(createCarWashServiceSQL);
                PreparedStatement query5 = connection.prepareStatement(createBookingsSQL);
        ) {
            query1.executeUpdate();
            query2.executeUpdate();
            query3.executeUpdate();
            query4.executeUpdate();
            query5.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new JwtInterceptor());
    }
}