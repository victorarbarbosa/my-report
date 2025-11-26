package com.myreport.api.api.controllers;

import com.myreport.api.application.ReportMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping("api/message")
public class ReportMessageController {
    @Autowired
    private ReportMessageService messageService;

    @PostMapping
    public ResponseEntity<?> createNewMessage(@RequestParam UUID reportId, @RequestParam UUID senderId,
                                              @RequestParam String message) {
        messageService.createNewMessage(reportId, senderId, message);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<?> updateMessage(
            @PathVariable UUID messageId,
            @RequestParam UUID senderId,
            @RequestParam String newMessage
    ) {
        try {
            messageService.updateMessage(messageId, senderId, newMessage);
            return ResponseEntity.ok().build();
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não autorizado.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
