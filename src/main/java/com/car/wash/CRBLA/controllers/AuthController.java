package com.car.wash.CRBLA.controllers;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.car.wash.CRBLA.domain.User;
import com.car.wash.CRBLA.services.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.TextCodec;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/auth")
public class AuthController {

	@Value("${spring.application.secretkey}")
	private String secretKey;

	private final UserService userService;

	public AuthController(UserService userService) {
		this.userService = userService;
	}

	public String generateJwtToken(Long id, String role) {
		String jws = Jwts.builder()
			.setIssuer("CarWash")
			.setSubject(role)
			.claim("id",id)
			.setIssuedAt(Date.from(Instant.now()))
			.setExpiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
			.signWith(
				SignatureAlgorithm.HS256,
				TextCodec.BASE64.decode(secretKey)
			)
			.compact();

		return jws;
	}

	public String getSHA256Hash(String input, Long salt) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			String saltedInput = input + salt;
			byte[] hash = md.digest(saltedInput.getBytes(StandardCharsets.UTF_8));
			BigInteger number = new BigInteger(1, hash);
			StringBuilder hexString = new StringBuilder(number.toString(16));
			while (hexString.length() < 32) {
				hexString.insert(0, '0');
			}
			return hexString.toString();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@PostMapping("/login")
	@ResponseBody
	public ResponseEntity<String> login(@RequestBody Map<String,String> params, HttpServletResponse response) {
		String email = params.get("email");
		String password = params.get("password");

		User user = userService.findByEmail(email);
		if (user == null || !user.getPassword().equals(getSHA256Hash(password, user.getId()))) {
			return new ResponseEntity<>("{}", HttpStatus.UNAUTHORIZED);
		}

		Cookie cookie = new Cookie("accessToken", generateJwtToken(user.getId(), user.getRole()));
		cookie.setMaxAge(3600);
		cookie.setSecure(true);
		cookie.setHttpOnly(true);
		response.addCookie(cookie);
		return new ResponseEntity<>("{}", HttpStatus.OK);
	}

	@PostMapping("/register")
	@ResponseBody
	public ResponseEntity<String> register(@RequestBody Map<String,String> params, HttpServletResponse response) {
		String fullName = params.get("fullName");
		String email = params.get("email");
		String password = params.get("password");

		User user = userService.findByEmail(email);
		
		if (user != null) {
			return new ResponseEntity<>("{}", HttpStatus.CONFLICT);
		}

		user = new User(null, fullName, email, "", "user", true);
		user = userService.saveUser(user);
		user.setPassword(getSHA256Hash(password, user.getId()));
		user = userService.updateUser(user);

		Cookie cookie = new Cookie("accessToken", generateJwtToken(user.getId(), user.getRole()));
		cookie.setMaxAge(3600);
		cookie.setSecure(true);
		cookie.setHttpOnly(true);
		response.addCookie(cookie);

		return new ResponseEntity<>("{}", HttpStatus.OK);
	}

}
