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
import com.car.wash.CRBLA.domain.User;

@Service
public class UserServiceImplementation extends CoreJDBCDao implements UserService {
	
	@Override
	public List<User> findAll() {
		List<User> users = new ArrayList<>();
		String sql = "SELECT * FROM user;";
		try (
				PreparedStatement findAll = connection.prepareStatement(sql);
		) {
			ResultSet rs = findAll.executeQuery();
			while (rs.next()){
				User u = new User(rs.getLong("ID"), rs.getString("fullName"), rs.getString("email"), rs.getString("password"), rs.getString("role"), rs.getBoolean("active"));
				users.add(u);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return users;
	}

	@Override
	public User findById(Long id) {
		User user = null;
		String sql = "SELECT * FROM user WHERE ID = ?;";
		try (
				PreparedStatement findById = connection.prepareStatement(sql);
		) {
			findById.setLong(1, id);
			ResultSet rs = findById.executeQuery();
			if (rs.next()){
				user = new User(rs.getLong("ID"), rs.getString("fullName"), rs.getString("email"), rs.getString("password"), rs.getString("role"), rs.getBoolean("active"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return user;
	}

	@Override
	public User findByEmail(String email) {
		User user = null;
		String sql = "SELECT * FROM user WHERE email = ?;";
		try (
				PreparedStatement findByEmail = connection.prepareStatement(sql);
		) {
			findByEmail.setString(1, email);
			ResultSet rs = findByEmail.executeQuery();
			if (rs.next()){
				user = new User(rs.getLong("ID"), rs.getString("fullName"), rs.getString("email"), rs.getString("password"), rs.getString("role"), rs.getBoolean("active"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return user;
	}

	@Override
	public User saveUser(User user) {
		String sql = "INSERT INTO user (fullName, email, password, role, active) VALUES (?, ?, ?, ?, ?);";
		try (
				PreparedStatement saveUser = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
		) {
			saveUser.setString(1, user.getFullName());
			saveUser.setString(2, user.getEmail());
			saveUser.setString(3, user.getPassword());
			saveUser.setString(4, user.getRole());
			saveUser.setBoolean(5, user.getActive());
			saveUser.executeUpdate();
			var generatedKeys = saveUser.getGeneratedKeys();
			if (generatedKeys.next()) {
				user.setId(generatedKeys.getLong(1));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return user;
	}

	@Override
	public User updateUser(User user) {
		String sql = "UPDATE user SET fullName = ?, email = ?, password = ?, role = ?, active = ? WHERE ID = ?;";
		try (
				PreparedStatement updateUser = connection.prepareStatement(sql);
		) {
			updateUser.setString(1, user.getFullName());
			updateUser.setString(2, user.getEmail());
			updateUser.setString(3, user.getPassword());
			updateUser.setString(4, user.getRole());
			updateUser.setBoolean(5, user.getActive());
			updateUser.setLong(6, user.getId());
			updateUser.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return user;
	}
	
}