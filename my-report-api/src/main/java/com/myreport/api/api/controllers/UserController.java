package com.myreport.api.api.controllers;

import com.myreport.api.api.dto.UpdatePasswordDto;
import com.myreport.api.api.dto.UserDto;
import com.myreport.api.api.dto.UserUpdateDto;
import com.myreport.api.application.FollowService;
import com.myreport.api.application.UserService;
import com.myreport.api.domain.entities.Follower;
import com.myreport.api.domain.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private FollowService followService;

    @GetMapping("{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(new UserDto(userService.getUserById(id)));
    }

    @GetMapping(value = "/{id}/profile-image", produces = MediaType.ALL_VALUE)
    public ResponseEntity<byte[]> getProfileImage(@PathVariable UUID id) {
        byte[] imageBytes = userService.getUserProfileImage(id);

        if (imageBytes == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes);
    }

    @GetMapping("/search/company")
    public ResponseEntity<Page<UserDto>> searchCompaniesByName(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDto> companies = userService.searchCompanyByName(name, page, size);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/company/default")
    public ResponseEntity<List<UserDto>> getDefaultCompanies() {
        List<UserDto> companies = userService.getDefaultCompanies();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam("query") String query) {
        List<User> users = userService.searchUsersByName(query);
        List<UserDto> userDtos = users.stream()
                .map(UserDto::new)
                .toList();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{id}/{userLoggedId}/is-following")
    public ResponseEntity<Boolean> isFollowing(
            @PathVariable UUID id,
            @PathVariable UUID userLoggedId
    ) {
        boolean isFollowing = followService.isFollowing(userLoggedId, id);
        return ResponseEntity.ok(isFollowing);
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserDto>> following(@PathVariable UUID id) {
        return ResponseEntity.ok(
                followService
                        .getFollowing(id).stream()
                        .map(Follower::getFollowing)
                        .map(UserDto::new).toList());
    }

    @PostMapping("/{id}/{userLoggedId}/follow")
    public ResponseEntity<?> followUser(
            @PathVariable UUID id,
            @PathVariable UUID userLoggedId
    ) {
        followService.follow(userLoggedId, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/{userLoggedId}/follow")
    public ResponseEntity<?> unfollowUser(
            @PathVariable UUID id,
            @PathVariable UUID userLoggedId
    ) {
        followService.unfollow(userLoggedId, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID id,
                                              @RequestBody UserUpdateDto userDto) {
        var user = userService.updateUser(id, userDto);
        return ResponseEntity.ok(new UserDto(user));
    }

    @PutMapping(value = "/{id}/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity updateProfileImage(@PathVariable UUID id, @RequestParam("file") MultipartFile image) {
        try {
            userService.updateProfileImage(id, image);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("{id}/password")
    public ResponseEntity<UserDto> updateUserPassword(@PathVariable UUID id, @RequestBody UpdatePasswordDto passwordDto) {
        var success = userService.updatePassword(id, passwordDto);
        if(!success) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
