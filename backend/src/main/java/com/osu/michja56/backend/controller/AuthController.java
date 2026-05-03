package com.osu.michja56.backend.controller;

import com.osu.michja56.backend.dto.LoginRequest;
import com.osu.michja56.backend.dto.RegisterRequest;
import com.osu.michja56.backend.dto.UserResponse;
import com.osu.michja56.backend.dto.ChangePasswordRequest;
import com.osu.michja56.backend.model.User;
import com.osu.michja56.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginData) {
        Optional<User> user = userRepository.findByUsername(loginData.getUsername());

        if (user.isPresent() && passwordMatches(user.get(), loginData.getPassword())) {
            return ResponseEntity.ok(UserResponse.from(user.get()));
        }

        return ResponseEntity.status(401).body("Neplatné jméno nebo heslo");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerData) {
        if (!StringUtils.hasText(registerData.getUsername())
                || !StringUtils.hasText(registerData.getPassword())
                || !StringUtils.hasText(registerData.getEmail())) {
            return ResponseEntity.badRequest().body("Vyplňte uživatelské jméno, e-mail a heslo.");
        }

        if (userRepository.findByUsername(registerData.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Uživatelské jméno už existuje.");
        }

        if (userRepository.findByEmail(registerData.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail už existuje.");
        }

        User user = new User();
        user.setUsername(registerData.getUsername().trim());
        user.setPassword(passwordEncoder.encode(registerData.getPassword()));
        user.setEmail(registerData.getEmail().trim());
        user.setFirstName(trimToNull(registerData.getFirstName()));
        user.setLastName(trimToNull(registerData.getLastName()));
        user.setRole("USER");

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(saved));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        if (request == null
                || request.getUserId() == null
                || !StringUtils.hasText(request.getCurrentPassword())
                || !StringUtils.hasText(request.getNewPassword())) {
            return ResponseEntity.badRequest().body("Vyplňte aktuální a nové heslo.");
        }

        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Uživatel neexistuje.");
        }

        User user = userOpt.get();
        if (!passwordMatches(user, request.getCurrentPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Aktuální heslo není správné.");
        }

        String newPassword = request.getNewPassword().trim();
        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Nové heslo musí mít alespoň 6 znaků.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Heslo bylo změněno.");
    }

    private boolean passwordMatches(User user, String rawPassword) {
        String stored = user.getPassword();
        if (stored == null || rawPassword == null) {
            return false;
        }

        boolean matches = isBcryptHash(stored)
                ? passwordEncoder.matches(rawPassword, stored)
                : stored.equals(rawPassword);

        if (matches && !isBcryptHash(stored)) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        }

        return matches;
    }

    private boolean isBcryptHash(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}