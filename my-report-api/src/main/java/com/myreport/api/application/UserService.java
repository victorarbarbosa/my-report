package com.myreport.api.application;

import com.myreport.api.api.dto.UserDto;
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

    public void createNewUser(UserDto userDto, MultipartFile profileImage) throws Exception {
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
    }
}
