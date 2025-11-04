package com.myreport.api.api.dto;

import com.myreport.api.domain.entities.Report;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ReportDto {
    private UUID id;
    private String title;
    private String reportMessage;
    private boolean isResolved;
    private int upvoteNumber;
    private byte[] image;
    private UUID companyId;
    private UUID userId;
    private Date createdDate;
    private List<ReportMessageDto> messages;

    public ReportDto(Report report) {
        id = report.getId();
        title = report.getTitle();
        reportMessage = report.getReportMessage();
        isResolved = report.isResolved();
        upvoteNumber = report.getUpvoteNumber();
        image = report.getImage();
        companyId = report.getCompanyId();
        userId = report.getUserId();
        createdDate = report.getCreatedDate();

        messages = report.getMessages().stream().map(ReportMessageDto::new).toList();
    }
}
