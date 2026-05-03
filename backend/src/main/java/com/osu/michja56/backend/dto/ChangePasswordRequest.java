package com.osu.michja56.backend.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    private Long userId;
    private String currentPassword;
    private String newPassword;
}

