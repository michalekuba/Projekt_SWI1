package com.osu.michja56.backend.dto;

import com.osu.michja56.backend.model.User;
import lombok.Data;

@Data
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String street;
    private String city;
    private String postalCode;
    private String phone;
    private String role;

    public static UserResponse from(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setStreet(user.getStreet());
        response.setCity(user.getCity());
        response.setPostalCode(user.getPostalCode());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        return response;
    }
}
