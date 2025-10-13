package com.myreport.api.domain.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
public class ReportMessage {
    @Id
    private UUID id;
    private String message;
    private byte[] anexedImage;
    private UUID userId;
    @ManyToOne
    private Report report;
}
