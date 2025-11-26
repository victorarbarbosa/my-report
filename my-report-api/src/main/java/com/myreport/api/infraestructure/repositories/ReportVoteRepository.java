package com.myreport.api.infraestructure.repositories;

import com.myreport.api.domain.entities.ReportVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ReportVoteRepository extends JpaRepository<ReportVote, UUID> {
    Optional<ReportVote> findByReportIdAndUserId(UUID reportId, UUID userId);
}