package com.myreport.api.application;

import com.myreport.api.domain.entities.ReportMessage;
import com.myreport.api.infraestructure.repositories.ReportMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class ReportMessageService {
    @Autowired
    private static ReportMessageRepository messageRepository;

    public void createNewMessage(UUID reportId , UUID senderId, String messageText, MultipartFile image) throws IOException {


        var message = ReportMessage.builder()
                .id(UUID.randomUUID())
                .message(messageText)
                .anexedImage(image.getBytes())
                .createdDate(LocalDate.now())
                .build();


    }
}
