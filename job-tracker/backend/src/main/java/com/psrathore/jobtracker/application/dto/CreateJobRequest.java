package com.psrathore.jobtracker.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * What the client sends us when creating a job application.
 * Deliberately separate from the entity so clients can't set id or status.
 */
public record CreateJobRequest(
        @NotBlank @Size(max = 120) String company,
        @NotBlank @Size(max = 120) String role,
        @NotNull LocalDate appliedDate,
        @Size(max = 2000) String notes,
        @Size(max = 500) String url
) {}
