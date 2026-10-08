package com.psrathore.jobtracker.web;

import com.psrathore.jobtracker.application.JobApplicationNotFoundException;
import com.psrathore.jobtracker.application.JobApplicationService;
import com.psrathore.jobtracker.application.dto.CreateJobRequest;
import com.psrathore.jobtracker.application.dto.JobApplicationResponse;
import com.psrathore.jobtracker.application.dto.UpdateJobRequest;
import com.psrathore.jobtracker.application.dto.UpdateStatusRequest;
import com.psrathore.jobtracker.domain.ApplicationStatus;
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

    /**
     * GET /api/jobs
     * GET /api/jobs?status=INTERVIEW
     * GET /api/jobs?q=acme
     * GET /api/jobs?status=APPLIED&q=senior
     */
    @GetMapping
    public List<JobApplicationResponse> list(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false, name = "q") String query) {
        return service.findAll(status, query).stream()
                .map(JobApplicationResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public JobApplicationResponse get(@PathVariable Long id) {
        return JobApplicationResponse.from(service.findOne(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplicationResponse create(@Valid @RequestBody CreateJobRequest req) {
        return JobApplicationResponse.from(service.create(req));
    }

    @PutMapping("/{id}")
    public JobApplicationResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobRequest req) {
        return JobApplicationResponse.from(service.update(id, req));
    }

    @PatchMapping("/{id}/status")
    public JobApplicationResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest req) {
        return JobApplicationResponse.from(service.updateStatus(id, req.status()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @ExceptionHandler(JobApplicationNotFoundException.class)
    public ResponseEntity<String> handleNotFound(JobApplicationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}