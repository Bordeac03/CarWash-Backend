package com.car.wash.CRBLA.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarWash {
    private Long id;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private boolean active;
    private String openTime;
    private String contact;

    @Override
    public String toString() {
        return "{\"ID\":\"" + id + "\",\"name\":\"" + name + "\",\"address\":\"" + address + "\",\"latitude\":\"" + latitude + "\",\"longitude\":\"" + longitude + "\",\"active\":\"" + active + "\",\"openTime\":\"" + openTime + "\",\"contact\":\"" + contact + "\"}";
    }
}
