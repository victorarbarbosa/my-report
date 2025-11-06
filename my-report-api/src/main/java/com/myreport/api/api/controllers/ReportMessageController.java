package com.myreport.api.api.controllers;

import com.myreport.api.application.ReportMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("api/message")
public class ReportMessageController {
    @Autowired
    private static ReportMessageService messageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createNewMessage(@RequestParam UUID reportId, @RequestParam UUID senderId,
                                              @RequestParam String message, @RequestParam MultipartFile image) {
        try {
            messageService.createNewMessage(reportId, senderId, message, image);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok().build();
    }
}
