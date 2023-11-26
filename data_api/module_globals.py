import win32job

processes = {}
is_capturing = False

job = win32job.CreateJobObject(None, "")
extended_info = win32job.QueryInformationJobObject(job, win32job.JobObjectExtendedLimitInformation)
extended_info['BasicLimitInformation']['LimitFlags'] = win32job.JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
win32job.SetInformationJobObject(job, win32job.JobObjectExtendedLimitInformation, extended_info)
