package com.myreport.api.domain.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Builder
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
    @OneToMany
    private List<ReportMessage> messages;
}
