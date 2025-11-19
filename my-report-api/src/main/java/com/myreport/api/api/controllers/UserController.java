package com.myreport.api.api.controllers;

import com.myreport.api.api.dto.UpdatePasswordDto;
import com.myreport.api.api.dto.UserDto;
import com.myreport.api.api.dto.UserUpdateDto;
import com.myreport.api.application.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.UUID;

@RestController
@RequestMapping("api/user")
public class UserController {
    @Autowired
    private static UserService userService;

    @GetMapping("{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(new UserDto(userService.getUserById(id)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createUser(@RequestPart("user") UserDto userDto, @RequestPart("profileImage") MultipartFile profileImage) throws URISyntaxException {
        try {
            UUID createdUserId;

            createdUserId = userService.createUser(userDto, profileImage);

            return ResponseEntity.created(new URI("/api/user" + createdUserId)).build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID id,
                                              @RequestPart("user") UserUpdateDto userDto,
                                              @RequestPart("profileImage") MultipartFile image) {
        try {
            var user = userService.updateUser(id, userDto, image);
            return ResponseEntity.ok(new UserDto(user));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<UserDto> updateUserPassword(@PathVariable UUID id, @RequestBody UpdatePasswordDto passwordDto) {
        userService.updatePassword(id, passwordDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
