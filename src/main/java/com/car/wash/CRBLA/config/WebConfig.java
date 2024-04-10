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
        String insertUsersSQL = "CREATE TABLE IF NOT EXISTS user (ID INT NOT NULL AUTO_INCREMENT, email varchar(255) NOT NULL, password varchar(255) NOT NULL, fullName VARCHAR(255) NULL, active BOOLEAN DEFAULT 1, PRIMARY KEY (ID), UNIQUE(`email`));";
        try (
                PreparedStatement insertUser = connection.prepareStatement(insertUsersSQL);
        ) {
            insertUser.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new JwtInterceptor());
    }
}