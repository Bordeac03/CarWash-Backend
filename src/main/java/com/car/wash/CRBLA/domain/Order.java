package com.car.wash.CRBLA.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;
    private Long userID;
    private Long carWashID;
    private Long serviceID;
    private Integer ts;
    private Boolean closeBy;
    private Boolean active;

    @Override
    public String toString() {
        return "{\"ID\":\"" + id + "\",\"userID\":\"" + userID + "\",\"carWashID\":\"" + carWashID + "\",\"serviceID\":\"" + serviceID + "\",\"ts\":\"" + ts + "\",\"closeBy\":\"" + closeBy + "\",\"active\":\"" + active + "\"}";
    }

    public String toStringFull(Product product, User user) {
        return "{\"ID\":\"" + id + "\",\"user\":\"" + user.toString() + "\",\"carWashID\":\"" + carWashID + "\",\"service\":\"" + product.toString() + "\",\"ts\":\"" + ts + "\",\"closeBy\":\"" + closeBy + "\",\"active\":\"" + active + "\"}";
    }

}
