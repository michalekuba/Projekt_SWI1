package com.osu.michja56.backend.dto;

import lombok.Data;

@Data
public class AddToCartRequest {

    private Long productId;
    private Integer quantity;
}

