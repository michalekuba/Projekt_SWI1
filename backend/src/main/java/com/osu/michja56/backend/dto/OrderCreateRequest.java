package com.osu.michja56.backend.dto;

import lombok.Data;

@Data
public class OrderCreateRequest {

    private Boolean useProfile;
    private String firstName;
    private String lastName;
    private String street;
    private String city;
    private String postalCode;
    private String email;
    private String phone;
    private String shippingMethod;
}
