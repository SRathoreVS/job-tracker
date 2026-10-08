package com.psrathore.jobtracker.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Full update — replaces every field. PUT semantics.
 * Every field is required (except optional ones marked as such).
 */
public record UpdateJobRequest(
        @NotBlank @Size(max = 120) String company,
        @NotBlank @Size(max = 120) String role,
        @NotNull LocalDate appliedDate,
        @Size(max = 2000) String notes,
        @Size(max = 500) String url
) {}