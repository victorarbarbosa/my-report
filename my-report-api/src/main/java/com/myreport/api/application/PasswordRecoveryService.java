package com.myreport.api.application;

import com.myreport.api.domain.entities.RecoveryCode;
import com.myreport.api.infraestructure.repositories.RecoveryCodeRepository;
import com.myreport.api.infraestructure.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordRecoveryService {
    @Autowired
    private RecoveryCodeRepository repo;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void sendRecoveryCode(String email) {
        var user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email não encontrado"));

        String code = String.valueOf((int)(Math.random() * 900000) + 100000);

        RecoveryCode recovery = new RecoveryCode();
        recovery.setId(UUID.randomUUID());
        recovery.setEmail(email);
        recovery.setCode(code);
        recovery.setExpiresAt(LocalDateTime.now().plusMinutes(10));

        repo.save(recovery);

        emailService.sendEmail(email, "Código de recuperação", "Seu código é: " + code);
    }

    public void resetPassword(String email, String code, String newPassword) {
        var recovery = repo.findByEmailAndCode(email, code)
                .orElseThrow(() -> new RuntimeException("Código inválido."));

        if (recovery.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código expirado.");
        }

        var user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        repo.delete(recovery);
    }
}
