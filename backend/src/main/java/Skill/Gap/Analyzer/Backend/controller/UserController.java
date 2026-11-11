package Skill.Gap.Analyzer.Backend.controller;

import Skill.Gap.Analyzer.Backend.entity.User;
import Skill.Gap.Analyzer.Backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5500"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        User savedUser = userService.registerUser(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        return userService.findByEmail(user.getEmail())
                .map(existingUser -> {

                    if (existingUser.getPassword().equals(user.getPassword())) {
                        return ResponseEntity.ok(existingUser);
                    }

                    return ResponseEntity.badRequest()
                            .body("Invalid email or password");

                })
                .orElse(
                    ResponseEntity.badRequest()
                            .body("Invalid email or password")
                );
    }
}