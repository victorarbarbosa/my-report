package com.myreport.api.api.controllers;

import com.myreport.api.api.dto.ReportDto;
import com.myreport.api.api.dto.SearchReportsRequest;
import com.myreport.api.api.dto.UserDto;
import com.myreport.api.application.ReportService;
import com.myreport.api.domain.entities.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/report")
public class ReportController {
    @Autowired
    private ReportService service;

    @GetMapping("/{id}")
    public ResponseEntity<ReportDto> getReportById(@PathVariable UUID id) {
        var result = service.getReportById(id);
        if (result == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new ReportDto(result));
    }

    @GetMapping("/{id}/user")
    public ResponseEntity<List<ReportDto>> getReportsByUserId(@PathVariable UUID id) {
        var result = service.getReportsByUserId(id);
        if (result == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(result.stream().map(ReportDto::new).toList());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ReportDto>> getRecentReports() {
        var reportDtos = service.getLastReports().stream().map(ReportDto::new).toList();
        return ResponseEntity.ok(reportDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ReportDto>> searchReports(@RequestParam String searchTerm) {
        var result = service.searchReports(searchTerm).stream().map(ReportDto::new).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/{id}/report-image", produces = MediaType.ALL_VALUE)
    public ResponseEntity<byte[]> getProfileImage(@PathVariable UUID id) {
        byte[] imageBytes = service.getReportImage(id);

        if (imageBytes == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .body(imageBytes);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportDto> createReport(@RequestPart("report") ReportDto report, @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            var createdReport = service.createReport(report, image);
            return ResponseEntity.ok(new ReportDto(createdReport));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<ReportDto> upvote(@PathVariable UUID id, @RequestHeader("userId") UUID userId) {
        return ResponseEntity.ok(service.vote(id, userId, "UP"));
    }

    @PostMapping("/{id}/downvote")
    public ResponseEntity<ReportDto> downvote(@PathVariable UUID id, @RequestHeader("userId") UUID userId) {
        return ResponseEntity.ok(service.vote(id, userId, "DOWN"));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateReport(
            @PathVariable UUID id,
            @RequestParam UUID userId,
            @RequestParam String title,
            @RequestParam String message,
            @RequestPart(required = false) MultipartFile image,
            @RequestParam UUID companyId
    ) {
        var reportDto = ReportDto.builder()
                .title(title)
                .reportMessage(message)
                .companyId(companyId)
                .build();

        try {
            var updatedReport = service.updateReport(id, reportDto, image);
            if(updatedReport == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(new ReportDto(updatedReport));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/{reportId}/resolve")
    public ResponseEntity<?> resolve(
            @PathVariable UUID reportId,
            @RequestHeader("userId") UUID userId) {

        service.markAsResolved(reportId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable UUID id) {
        var existingReport = service.getReportById(id);
        if (existingReport == null) {
            return ResponseEntity.notFound().build();
        }

        service.deleteReport(id);
        return ResponseEntity.ok().build();
    }
}
