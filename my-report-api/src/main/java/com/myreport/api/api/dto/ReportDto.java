package com.myreport.api.api.dto;

import com.myreport.api.domain.entities.Report;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDto {
    private UUID id;
    private String title;
    private String reportMessage;
    private boolean isResolved;
    private int upvoteNumber;
    private UUID companyId;
    private UUID userId;
    private Date createdDate;
    private List<ReportMessageDto> messages;
    private String userFullName;
    private String companyName;

    public ReportDto(Report report) {
        id = report.getId();
        title = report.getTitle();
        reportMessage = report.getReportMessage();
        isResolved = report.isResolved();
        upvoteNumber = report.getUpvoteNumber();
        companyId = report.getCompany().getId();
        userId = report.getUser().getId();
        createdDate = report.getCreatedDate();
        userFullName = report.getUser().getName() + " " + report.getUser().getSecondName();
        companyName = report.getCompany().getName();

        if(report.getMessages() != null) {
            messages = report.getMessages().stream().map(ReportMessageDto::new).toList().reversed();
        }
    }
}
