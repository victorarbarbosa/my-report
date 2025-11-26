package com.myreport.api.application;

import com.myreport.api.api.dto.ReportDto;
import com.myreport.api.domain.entities.Report;
import com.myreport.api.domain.entities.ReportVote;
import com.myreport.api.domain.entities.User;
import com.myreport.api.infraestructure.repositories.ReportRepository;
import com.myreport.api.infraestructure.repositories.ReportVoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ReportVoteRepository voteRepository;

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

    public List<Report> getReportsByUserId(UUID userId) {
        return reportRepository.findAllByUserId(userId);
    }

    public byte[] getReportImage(UUID reportId) {
        return reportRepository.findReportImageById(reportId);
    }

    public Report createReport(ReportDto reportDto, MultipartFile image) throws IOException {
        var user = userService.getUserById(reportDto.getUserId());
        var company = userService.getUserById(reportDto.getCompanyId());

        var report = Report.builder()
                .id(UUID.randomUUID())
                .title(reportDto.getTitle())
                .reportMessage(reportDto.getReportMessage())
                .company(company)
                .user(user)
                .createdDate(Date.from(Instant.now()))
                .build();

        if (image != null && !image.isEmpty()) {
            report.setImage(image.getBytes());
        }

        reportRepository.save(report);

        return report;
    }

    public ReportDto vote(UUID reportId, UUID userId, String voteType) {
        Report report = reportRepository.findById(reportId).orElseThrow();
        User user = userService.getUserById(userId);

        var existing = voteRepository.findByReportIdAndUserId(reportId, userId);

        if (existing.isPresent()) {
            ReportVote vote = existing.get();

            if (!vote.getVoteType().equals(voteType)) {
                // usuário está mudando o voto
                vote.setVoteType(voteType);
                voteRepository.save(vote);

                // atualiza contagem
                if (voteType.equals("UP")) {
                    report.setUpvoteNumber(report.getUpvoteNumber() + 2);
                } else {
                    report.setUpvoteNumber(report.getUpvoteNumber() - 2);
                }
            }

        } else {
            // novo voto
            ReportVote newVote = ReportVote.builder()
                    .id(UUID.randomUUID())
                    .report(report)
                    .user(user)
                    .voteType(voteType)
                    .build();

            voteRepository.save(newVote);

            if (voteType.equals("UP"))
                report.setUpvoteNumber(report.getUpvoteNumber() + 1);
            else
                report.setUpvoteNumber(report.getUpvoteNumber() - 1);
        }

        reportRepository.save(report);
        return new ReportDto(report);
    }

    public Report updateReport(UUID reportId, ReportDto reportDto, MultipartFile image) throws IOException {
        var existingReport = getReportById(reportId);
        if (existingReport == null)
            return null;

        var company = userService.getUserById(reportDto.getCompanyId());

        existingReport.setTitle(reportDto.getTitle());
        existingReport.setReportMessage(reportDto.getReportMessage());
        existingReport.setCompany(company);

        if(image != null && !image.isEmpty()) {
            existingReport.setImage(image.getBytes());
        } else {
            existingReport.setImage(null);
        }

        return reportRepository.save(existingReport);
    }

    public void markAsResolved(UUID reportId, UUID userId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!report.getUser().getId().equals(userId)) {
            throw new RuntimeException("Only the owner can resolve!");
        }

        report.setResolved(true);
        reportRepository.save(report);
    }


    public void deleteReport(UUID id) {
        reportRepository.deleteById(id);
    }
}
