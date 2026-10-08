package com.psrathore.jobtracker.domain;

/**
 * The pipeline stages a job application moves through.
 * Kept as an enum (not a String) so the database and the API
 * agree on what values are legal.
 */
public enum ApplicationStatus {
    APPLIED,
    INTERVIEW,
    OFFER,
    REJECTED
}
