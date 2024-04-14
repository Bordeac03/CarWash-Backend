package com.car.wash.CRBLA.domain;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    private Long id;
    private String name;
    private Long carWashID;
    private double price;
    private boolean active;

    @Override
    public String toString() {
        return "{\"ID\":\"" + id + "\",\"name\":\"" + name + "\",\"carWashID\":\"" + carWashID + "\",\"price\":\"" + price + "\",\"active\":\"" + active + "\"}";
    }
}
