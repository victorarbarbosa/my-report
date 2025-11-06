package com.myreport.api.domain.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class User {
    @Id
    private UUID id;
    private String name;
    private String secondName;
    private String email;
    private String password;
    private String cpf;
    private String rg;
    private String cnpj;
    private LocalDate birthDate;
    private LocalDateTime createdDate;
    private byte[] profileImage;
    private String phoneNumber;
    private boolean isCompany;
}
