package com.osu.michja56.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class OrderResponse {

    private Long id;
    private Long userId;
    private List<OrderItemResponse> items = new ArrayList<>();
    private BigDecimal total;
    private String status;
    private LocalDateTime createdAt;
    private String billingFirstName;
    private String billingLastName;
    private String billingStreet;
    private String billingCity;
    private String billingPostalCode;
    private String billingEmail;
    private String billingPhone;
    private String shippingMethod;
}
