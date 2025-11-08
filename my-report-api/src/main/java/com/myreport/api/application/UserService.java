package com.myreport.api.application;

import com.myreport.api.api.dto.UpdatePasswordDto;
import com.myreport.api.api.dto.UserDto;
import com.myreport.api.api.dto.UserUpdateDto;
import com.myreport.api.domain.entities.User;
import com.myreport.api.infraestructure.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private static UserRepository userRepository;

    public User getUserById(UUID userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    public UUID createUser(UserDto userDto, MultipartFile profileImage) throws Exception {
        var user = User.builder()
                .id(UUID.randomUUID())
                .name(userDto.getName())
                .email(userDto.getEmail())
                .createdDate(LocalDateTime.now())
                .profileImage(profileImage.getBytes())
                .phoneNumber(userDto.getPhoneNumber())
                .build();

        if(user.isCompany()) {
            user.setCnpj(user.getCnpj());
        } else {
            user.setSecondName(userDto.getSecondName());
            user.setCpf(user.getCpf());
            user.setRg(user.getRg());
            user.setBirthDate(userDto.getBirthDate());
        }

        userRepository.save(user);

        return user.getId();
    }

    public User updateUser(UUID userId, UserUpdateDto userDto, MultipartFile profileImage) throws IOException {
        var user = getUserById(userId);
        user.setName(userDto.getName());
        user.setSecondName(userDto.getSecondName());
        user.setEmail(userDto.getEmail());
        user.setBirthDate(userDto.getBirthDate());
        user.setProfileImage(profileImage.getBytes());
        user.setPhoneNumber(userDto.getPhoneNumber());

        userRepository.save(user);

        return user;
    }

    public void updatePassword(UUID userId, UpdatePasswordDto passwordDto) {
        var user = getUserById(userId);
        user.setPassword(passwordDto.getPassword());
        userRepository.save(user);
    }

    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
    }
}
