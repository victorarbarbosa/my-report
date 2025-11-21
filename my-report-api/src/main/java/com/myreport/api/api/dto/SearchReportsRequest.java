package com.myreport.api.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SearchReportsRequest {
    private String searchTerm;
}
