package com.myreport.api.api.controllers;

import com.myreport.api.api.dto.ReportDto;
import com.myreport.api.api.dto.SearchReportsRequest;
import com.myreport.api.application.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/report")
public class ReportController {
    @Autowired
    private ReportService service;

    @GetMapping("/{id}")
    public ResponseEntity<ReportDto> getReportById(@PathVariable UUID reportId) {
        var result = service.getReportById(reportId);
        if (result == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new ReportDto(result));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ReportDto>> getRecentReports() {
        var reportDtos = service.getLastReports().stream().map(ReportDto::new).toList();
        return ResponseEntity.ok(reportDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ReportDto>> searchReports(SearchReportsRequest searchRequest) {
        var result = service.searchReports(searchRequest.getSearchTerm()).stream().map(ReportDto::new).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ReportDto> createReport(@RequestBody ReportDto report) {
        var createdReport = service.createReport(report);
        return ResponseEntity.created(URI.create("/api/report/id")).build();
    }


}
