package com.myreport.api.api.dto;

import com.myreport.api.domain.entities.Report;
import com.myreport.api.domain.entities.ReportMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
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

        messages = report.getMessages().stream().map(ReportMessageDto::new).toList();
    }
}
