package com.myreport.api.application;

import com.myreport.api.api.dto.ReportDto;
import com.myreport.api.domain.entities.Report;
import com.myreport.api.infrastructure.repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Report getReportById(UUID reportId) {
        var report = reportRepository.findById(reportId);
        return report.orElse(null);
    }

    public List<Report> searchReports(String term) {
        return reportRepository.searchReports(term);
    }

    public List<Report> getLastReports() {
        return reportRepository.findByCreatedDateAfter(LocalDateTime.now().minusDays(15));
    }

    public Report createReport(ReportDto reportDto) {
        var report = Report.builder()
                .id(UUID.randomUUID())
                .title(reportDto.getTitle())
                .reportMessage(reportDto.getReportMessage())
                .image(reportDto.getImage())
                .companyId(reportDto.getCompanyId())
                .userId(reportDto.getUserId())
                .createdDate(Date.from(Instant.now()))
                .build();

        reportRepository.save(report);

        return report;
    }
}
