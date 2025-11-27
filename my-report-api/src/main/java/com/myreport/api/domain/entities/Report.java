package com.myreport.api.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "report")
public class Report {
    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;
    private String title;
    private String reportMessage;
    @Column(nullable = false)
    @Builder.Default
    private boolean isResolved = false;
    private int upvoteNumber;
    @Lob
    private byte[] image;
    @ManyToOne
    private User company;
    @ManyToOne
    private User user;
    private Date createdDate;
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReportMessage> messages;
}
