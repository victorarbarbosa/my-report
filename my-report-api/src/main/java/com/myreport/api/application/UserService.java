package com.myreport.api.application;

import com.myreport.api.api.dto.UpdatePasswordDto;
import com.myreport.api.api.dto.UserDto;
import com.myreport.api.api.dto.UserUpdateDto;
import com.myreport.api.domain.entities.User;
import com.myreport.api.infraestructure.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserById(UUID userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    public Optional<User> getUserByEmail(String email) { return userRepository.findUserByEmail(email); }

    public byte[] getUserProfileImage(UUID userId) {
        return userRepository.findProfileImageById(userId);
    }

    public Page<UserDto> searchCompanyByName(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result = userRepository
                .findByNameContainingIgnoreCase(name, pageable);

        return result.map(UserDto::new);
    }

    public List<UserDto> getDefaultCompanies() {
        return userRepository.findTop10ByIsCompanyTrueOrderByNameAsc().stream().map(UserDto::new).toList();
    }

    public List<User> searchUsersByName(String query) {
        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }
        return userRepository.findByNameContainingIgnoreCaseOrSecondNameContainingIgnoreCase(query, query);
    }

    public void updateProfileImage(UUID userId, MultipartFile image) throws IOException {
        var user = getUserById(userId);
        user.setProfileImage(image.getBytes());

        userRepository.save(user);
    }

    public UUID createUser(UserDto userDto) {
        var user = User.builder()
                .id(UUID.randomUUID())
                .name(userDto.getName())
                .email(userDto.getEmail())
                .cpf(userDto.getCpf())
                .cnpj(userDto.getCnpj())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .createdDate(LocalDateTime.now())
                .phoneNumber(userDto.getPhoneNumber())
                .isCompany(userDto.isCompany())
                .build();

        if(user.isCompany()) {
            user.setCnpj(user.getCnpj());
        } else {
            user.setSecondName(userDto.getSecondName());
            user.setCpf(user.getCpf());
            user.setBirthDate(userDto.getBirthDate());
        }

        userRepository.save(user);

        return user.getId();
    }

    public User updateUser(UUID userId, UserUpdateDto userDto) {
        var user = getUserById(userId);
        user.setName(userDto.getName());
        user.setSecondName(userDto.getSecondName());
        user.setEmail(userDto.getEmail());
        user.setBirthDate(userDto.getBirthDate());
        user.setPhoneNumber(userDto.getPhoneNumber());

        userRepository.save(user);

        return user;
    }

    public boolean updatePassword(UUID userId, UpdatePasswordDto passwordDto) {
        var user = getUserById(userId);
        if (!passwordEncoder.matches(passwordDto.getActualPassword(), user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
        userRepository.save(user);

        return true;
    }

    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
    }
}
