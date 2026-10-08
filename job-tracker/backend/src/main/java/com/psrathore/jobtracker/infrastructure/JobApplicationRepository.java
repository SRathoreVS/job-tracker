package com.psrathore.jobtracker.infrastructure;

import com.psrathore.jobtracker.domain.JobApplication;
import com.psrathore.jobtracker.domain.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Spring Data derives the query from the method name.
    // Reads as: "find all JobApplications where status = ? order by appliedDate desc"
    List<JobApplication> findAllByStatusOrderByAppliedDateDesc(ApplicationStatus status);

    List<JobApplication> findAllByOrderByAppliedDateDesc();
}
