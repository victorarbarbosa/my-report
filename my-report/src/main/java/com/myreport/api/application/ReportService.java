package com.myreport.api.application;

import com.myreport.api.domain.entities.Report;
import com.myreport.api.infrastructure.repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public List<Report> getLastReports() {
        return reportRepository.findAll();
    }
}
