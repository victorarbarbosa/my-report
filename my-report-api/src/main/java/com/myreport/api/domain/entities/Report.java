package com.myreport.api.domain.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Report {
    @Id
    private UUID id;
    private String title;
    private String reportMessage;
    private boolean isResolved;
    private int upvoteNumber;
    private byte[] image;
    private UUID companyId;
    private UUID userId;
    private Date createdDate;
    @OneToMany
    private List<ReportMessage> messages;
}
