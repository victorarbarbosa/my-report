package com.myreport.api.api.dto;

import com.myreport.api.domain.entities.ReportMessage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ReportMessageDto {
    private UUID id;
    private String message;
    private byte[] anexedImage;
    private UUID userId;
    private UUID reportId;

    public ReportMessageDto(ReportMessage reportMessage) {
        id = reportMessage.getId();
        message = reportMessage.getMessage();
        anexedImage = reportMessage.getAnexedImage();
        userId = reportMessage.getUserId();
        reportId = reportMessage.getReport().getId();
    }
}
