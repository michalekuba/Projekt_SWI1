package com.osu.michja56.backend.controller;

import com.osu.michja56.backend.dto.UpdateProfileRequest;
import com.osu.michja56.backend.dto.UserResponse;
import com.osu.michja56.backend.model.User;
import com.osu.michja56.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody UpdateProfileRequest request) {
        if (request == null
                || !StringUtils.hasText(request.getFirstName())
                || !StringUtils.hasText(request.getLastName())
                || !StringUtils.hasText(request.getStreet())
                || !StringUtils.hasText(request.getCity())
                || !StringUtils.hasText(request.getPostalCode())
                || !StringUtils.hasText(request.getEmail())
                || !StringUtils.hasText(request.getPhone())) {
            return ResponseEntity.badRequest().body("Vyplňte jméno, příjmení, ulici, město, PSČ, e-mail a telefon.");
        }

        return userRepository.findById(userId)
                .map(user -> {
                    if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                            && userRepository.findByEmail(request.getEmail()).isPresent()) {
                        return ResponseEntity.status(409).body("E-mail už existuje.");
                    }

                    user.setFirstName(request.getFirstName().trim());
                    user.setLastName(request.getLastName().trim());
                    user.setStreet(request.getStreet().trim());
                    user.setCity(request.getCity().trim());
                    user.setPostalCode(request.getPostalCode().trim());
                    user.setEmail(request.getEmail().trim());
                    user.setPhone(request.getPhone().trim());
                    User saved = userRepository.save(user);

                    return ResponseEntity.ok(UserResponse.from(saved));
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Uživatel neexistuje."));
    }
}
