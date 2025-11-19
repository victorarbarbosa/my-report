package com.myreport.api.api.dto;

import com.myreport.api.domain.entities.ReportMessage;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ReportMessageDto {
    private UUID id;
    private String message;
    private byte[] anexedImage;
    private UUID userId;
    private UUID reportId;
    private LocalDate createdDate;

    public ReportMessageDto(ReportMessage reportMessage) {
        id = reportMessage.getId();
        message = reportMessage.getMessage();
        anexedImage = reportMessage.getAnexedImage();
        userId = reportMessage.getUserId();
        reportId = reportMessage.getReport().getId();
        createdDate = reportMessage.getCreatedDate();
    }
}
