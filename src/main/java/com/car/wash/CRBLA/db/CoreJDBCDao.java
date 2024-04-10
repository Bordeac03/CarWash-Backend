package com.car.wash.CRBLA.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class CoreJDBCDao {
    protected Connection connection;
    protected CoreJDBCDao(){
        initDB();
    }

    public void initDB() {
        try {
            String url = "jdbc:mysql://localhost:3306/crbla";
            String user = "root";
            String password = "1234";
            connection = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.err.println("Connection cannot be established");
            e.printStackTrace();
        }
    }

    public void closeConnection(){
        try {
            connection.close();
        } catch (SQLException e) {
            System.err.println("Connection cannot be closed");
        }
    }
}
