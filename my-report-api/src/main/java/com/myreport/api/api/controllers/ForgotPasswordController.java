package com.myreport.api.api.controllers;

import com.myreport.api.api.dto.RecoverPasswordRequest;
import com.myreport.api.api.dto.ResetPasswordRequest;
import com.myreport.api.application.PasswordRecoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {
    @Autowired
    private PasswordRecoveryService service;

    @PostMapping("/recover")
    public ResponseEntity<?> recover(@RequestBody RecoverPasswordRequest req) {
        service.sendRecoveryCode(req.getEmail());
        return ResponseEntity.ok("Código enviado");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@RequestBody ResetPasswordRequest req) {
        service.resetPassword(req.getEmail(), req.getToken(), req.getNewPassword());
        return ResponseEntity.ok("Senha alterada");
    }
}
