package com.psrathore.jobtracker.application;

public class JobApplicationNotFoundException extends RuntimeException {
    public JobApplicationNotFoundException(Long id) {
        super("No job application with id " + id);
    }
}
