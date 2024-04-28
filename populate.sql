-- Insert into user
INSERT INTO user(email, password, fullName, role) VALUES 
('client1@example.com', 'password1', 'Client One', 'client'),
('carwash1@example.com', 'password2', 'Car Wash One', 'carwash'),
('admin1@example.com', 'password3', 'Admin One', 'admin'),
('client2@example.com', 'password4', 'Client Two', 'client'),
('carwash2@example.com', 'password5', 'Car Wash Two', 'carwash');

-- Insert into carWash
INSERT INTO carWash(name, address, latitude, longitude, openTime, contact) VALUES 
('Car Wash One', 'Bucharest Address 1', 44.4268, 26.1025, '08:00-18:00', '1234567890'),
('Car Wash Two', 'Bucharest Address 2', 44.4268, 26.1025, '08:00-18:00', '0987654321'),
('Car Wash Three', 'Bucharest Address 3', 44.4268, 26.1025, '08:00-18:00', '1122334455'),
('Car Wash Four', 'Bucharest Address 4', 44.4268, 26.1025, '08:00-18:00', '5566778899'),
('Car Wash Five', 'Bucharest Address 5', 44.4268, 26.1025, '08:00-18:00', '2233445566');

-- Insert into carWashConfig
INSERT INTO carWashConfig(userID, carWashID) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insert into carWashService
INSERT INTO carWashService(name, carWashID, price) VALUES 
('Service One', 1, 100.00),
('Service Two', 2, 200.00),
('Service Three', 3, 300.00),
('Service Four', 4, 400.00),
('Service Five', 5, 500.00);

-- Insert into booking
INSERT INTO booking(userID, carWashID, serviceID) VALUES 
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5);