package com.myreport.api.infraestructure.repositories;

import com.myreport.api.domain.entities.RecoveryCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecoveryCodeRepository extends JpaRepository<RecoveryCode, UUID> {
    Optional<RecoveryCode> findByEmail(String email);
    Optional<RecoveryCode> findByEmailAndCode(String email, String code);
}