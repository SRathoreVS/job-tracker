package com.psrathore.jobtracker.application;

import com.psrathore.jobtracker.application.dto.CreateJobRequest;
import com.psrathore.jobtracker.domain.JobApplication;
import com.psrathore.jobtracker.infrastructure.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    // Constructor injection. Spring sees this and wires the repository in.
    // No @Autowired needed on a single constructor — that's an old idiom.
    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplication> findAll() {
        return repository.findAllByOrderByAppliedDateDesc();
    }

    public JobApplication create(CreateJobRequest req) {
        JobApplication app = new JobApplication(req.company(), req.role(), req.appliedDate());
        app.setNotes(req.notes());
        app.setUrl(req.url());
        return repository.save(app);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new JobApplicationNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
