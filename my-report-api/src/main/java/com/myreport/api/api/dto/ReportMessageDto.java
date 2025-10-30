package com.myreport.api.api.dto;

import com.myreport.api.domain.entities.ReportMessage;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Date createdDate;

    public ReportMessageDto(ReportMessage reportMessage) {
        id = reportMessage.getId();
        message = reportMessage.getMessage();
        anexedImage = reportMessage.getAnexedImage();
        userId = reportMessage.getUserId();
        reportId = reportMessage.getReport().getId();
        createdDate = reportMessage.getCreatedDate();
    }
}
