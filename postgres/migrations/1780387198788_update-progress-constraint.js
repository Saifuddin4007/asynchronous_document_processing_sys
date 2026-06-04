export const up = (pgm) => {

    // remove old constraint
    pgm.dropConstraint(
        'jobs',
        'jobs_progress_percent_check'
    );

    // create new constraint
    pgm.addConstraint(
        'jobs',
        'jobs_progress_percent_check',
        {
            check: `
                progress_percent >= -1
                AND progress_percent <= 100
            `
        }
    );
};

export const down = (pgm) => {

    // rollback version
    pgm.dropConstraint(
        'jobs',
        'jobs_progress_percent_check'
    );

    // restore old constraint
    pgm.addConstraint(
        'jobs',
        'jobs_progress_percent_check',
        {
            check: `
                progress_percent >= 0
                AND progress_percent <= 100
            `
        }
    );
};