package com.myreport.api.application;

import com.myreport.api.domain.entities.ReportMessage;
import com.myreport.api.infraestructure.repositories.ReportMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class ReportMessageService {
    @Autowired
    private ReportMessageRepository messageRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ReportService reportService;

    public void createNewMessage(UUID reportId , UUID senderId, String messageText) {
        var user = userService.getUserById(senderId);
        var report = reportService.getReportById(reportId);

        var message = ReportMessage.builder()
                .id(UUID.randomUUID())
                .user(user)
                .report(report)
                .message(messageText)
                .createdDate(LocalDate.now())
                .build();

        messageRepository.save(message);
    }

    public void updateMessage(UUID messageId, UUID senderId, String newMessage)
            throws IllegalAccessException {

        ReportMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NoSuchElementException("Mensagem não encontrada"));

        // Apenas o dono pode editar
        if (!message.getUser().getId().equals(senderId)) {
            throw new IllegalAccessException("Usuário não autorizado");
        }

        message.setMessage(newMessage);
        messageRepository.save(message);
    }
}
