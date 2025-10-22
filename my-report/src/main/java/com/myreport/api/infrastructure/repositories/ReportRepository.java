package com.myreport.api.infrastructure.repositories;

import com.myreport.api.domain.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByCreatedDateAfter(LocalDateTime data);

    @Query("SELECT r FROM Report r " +
            "WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :termo, '%')) " +
            "   OR LOWER(r.reportMessage) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Report> searchReports(@Param("termo") String term);
}
