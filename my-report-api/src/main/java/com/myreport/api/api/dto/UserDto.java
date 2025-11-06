package com.myreport.api.api.dto;

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
    @Id
    private UUID id;
    private String name;
    private String secondName;
    private String email;
    private String cpf;
    private String rg;
    private String cnpj;
    private LocalDate birthDate;
    private LocalDateTime createdDate;
    private byte[] profileImage;
    private String phoneNumber;
    private boolean isCompany;
}
