package com.myreport.api.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    private String name;
    private String secondName;
    private String email;
    private LocalDate birthDate;
    private byte[] profileImage;
    private String phoneNumber;
}
