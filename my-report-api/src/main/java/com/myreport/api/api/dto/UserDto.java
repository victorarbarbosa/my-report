package com.myreport.api.api.dto;

import com.myreport.api.domain.entities.User;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String name;
    private String secondName;
    private String email;
    private String password;
    private String cpf;
    private String cnpj;
    private LocalDate birthDate;
    private LocalDateTime createdDate;
    private byte[] profileImage;
    private String phoneNumber;
    private boolean isCompany;

    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.createdDate = user.getCreatedDate();
        this.profileImage = user.getProfileImage();

        if(isCompany) {
            this.cnpj = user.getCnpj();
        } else {
            this.secondName = user.getSecondName();
            this.cpf = user.getCpf();
            this.birthDate = user.getBirthDate();
        }
    }
}
