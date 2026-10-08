package com.psrathore.jobtracker.application.dto;

import com.psrathore.jobtracker.domain.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Just the status — used when a user drags a card between columns
 * or picks from the "Move to →" dropdown.
 */
public record UpdateStatusRequest(
        @NotNull ApplicationStatus status) {
}