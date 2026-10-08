package com.psrathore.jobtracker.application;

import com.psrathore.jobtracker.application.dto.CreateJobRequest;
import com.psrathore.jobtracker.application.dto.UpdateJobRequest;
import com.psrathore.jobtracker.domain.ApplicationStatus;
import com.psrathore.jobtracker.domain.JobApplication;
import com.psrathore.jobtracker.infrastructure.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplication> findAll(ApplicationStatus status, String query) {
        List<JobApplication> all;
        if (status != null) {
            all = repository.findAllByStatusOrderByAppliedDateDesc(status);
        } else {
            all = repository.findAllByOrderByAppliedDateDesc();
        }

        if (query == null || query.isBlank()) {
            return all;
        }

        // Case-insensitive match on company OR role. In-memory is fine
        // for a personal tracker; swap for a Specification/JPA query
        // when the dataset grows past a few hundred rows.
        String needle = query.toLowerCase();
        return all.stream()
                .filter(a -> a.getCompany().toLowerCase().contains(needle)
                        || a.getRole().toLowerCase().contains(needle))
                .toList();
    }

    public JobApplication findOne(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new JobApplicationNotFoundException(id));
    }

    public JobApplication create(CreateJobRequest req) {
        JobApplication app = new JobApplication(req.company(), req.role(), req.appliedDate());
        app.setNotes(req.notes());
        app.setUrl(req.url());
        return repository.save(app);
    }

    public JobApplication update(Long id, UpdateJobRequest req) {
        JobApplication app = findOne(id);
        app.setCompany(req.company());
        app.setRole(req.role());
        app.setAppliedDate(req.appliedDate());
        app.setNotes(req.notes());
        app.setUrl(req.url());
        return repository.save(app);
    }

    public JobApplication updateStatus(Long id, ApplicationStatus status) {
        JobApplication app = findOne(id);
        app.setStatus(status);
        return repository.save(app);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new JobApplicationNotFoundException(id);
        }
        repository.deleteById(id);
    }
}