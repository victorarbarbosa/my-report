package com.myreport.api.api.controllers;

import com.myreport.api.api.dto.ReportDto;
import com.myreport.api.application.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/report")
public class ReportController {
    @Autowired
    private ReportService service;

    @GetMapping("/recent")
    public ResponseEntity<List<ReportDto>> getRecentReports() {
        var reportDtos = service.getLastReports().stream().map(ReportDto::new).toList();
        return ResponseEntity.ok(reportDtos);
    }

    @PostMapping
    public ResponseEntity<ReportDto> createReport(ReportDto report) {
        var createdReport = service.createReport(report);
        return ResponseEntity.created(URI.create("/api/report/id")).build();
    }
}
