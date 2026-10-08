package com.psrathore.jobtracker.web;

import com.psrathore.jobtracker.application.JobApplicationService;
import com.psrathore.jobtracker.application.JobApplicationNotFoundException;
import com.psrathore.jobtracker.application.dto.CreateJobRequest;
import com.psrathore.jobtracker.application.dto.JobApplicationResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<JobApplicationResponse> list() {
        return service.findAll().stream()
                .map(JobApplicationResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplicationResponse create(@Valid @RequestBody CreateJobRequest req) {
        return JobApplicationResponse.from(service.create(req));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // Small exception handler so a missing id returns 404, not 500.
    @ExceptionHandler(JobApplicationNotFoundException.class)
    public ResponseEntity<String> handleNotFound(JobApplicationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
