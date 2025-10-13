package com.myreport.api.infrastructure.repositories;

import com.myreport.api.domain.entities.ReportMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReportMessageRepository extends JpaRepository<ReportMessage, UUID> { }
