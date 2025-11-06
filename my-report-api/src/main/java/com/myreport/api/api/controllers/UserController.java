package com.myreport.api.api.controllers;

import com.myreport.api.api.dto.UserDto;
import com.myreport.api.application.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/user")
public class UserController {
    @Autowired
    private static UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createNewUser(@RequestPart("user") UserDto userDto, @RequestPart("profileImage") MultipartFile profileImage) {
        try {
            userService.createNewUser(userDto, profileImage);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok().build();
    }
}
