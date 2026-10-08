package com.psrathore.jobtracker.application.dto;

import com.psrathore.jobtracker.domain.ApplicationStatus;
import com.psrathore.jobtracker.domain.JobApplication;

import java.time.LocalDate;

public record JobApplicationResponse(
        Long id,
        String company,
        String role,
        ApplicationStatus status,
        LocalDate appliedDate,
        String notes,
        String url
) {
    // Mapping lives with the DTO so the controller and service stay clean.
    public static JobApplicationResponse from(JobApplication app) {
        return new JobApplicationResponse(
                app.getId(),
                app.getCompany(),
                app.getRole(),
                app.getStatus(),
                app.getAppliedDate(),
                app.getNotes(),
                app.getUrl()
        );
    }
}
