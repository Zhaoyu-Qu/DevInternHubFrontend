import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { JobForCreation } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addJob } from '../api/jobapi';
import Button from '@mui/material/Button';
// import JobDialogContent from './JobDialogContent';
import { useAuth } from '../AuthContext';
import { Tooltip } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material';
// import dayjs from 'dayjs';
import { useError } from '../ErrorContext';
function AddJob() {
    const { setErrorMessage } = useError();
    const { role } = useAuth();
    const queryClient = useQueryClient();
    const { mutate } = useMutation(addJob, {
        onSuccess: () => {
            queryClient.invalidateQueries(["jobs"]);
            setErrorMessage("");
        },
        onError: (err: Error) => {
            console.error(err);
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("An unknown error occurred while adding a new posting.");
            }
        }
    })
    const [open, setOpen] = useState(false);
    const [job, setJob] = useState<JobForCreation>({
        title: '',
        description: '',
        url: '',
        location: '',
        companyName: '',
        openingDate: '',
        closingDate: '',
        specialisation: '',
        type: '',
        technologies: []
    })

    // open the modal form
    const handleClickOpen = () => {
        setOpen(true);
    };

    // close the modal form
    const handleClose = () => {
        setJob({
            title: '',
            description: '',
            url: '',
            location: '',
            companyName: '',
            openingDate: '',
            closingDate: '',
            specialisation: '',
            type: '',
            technologies: []
        });
        setOpen(false);
    }

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    //     setJob({ ...job, [event.target.name]: event.target.value });
    // }

    // const handleDateChange = (propertyName: string, newValue: dayjs.Dayjs | null) => {
    //     const formattedDate = newValue ? newValue.format("YYYY-MM-DD") : '';
    //     setJob({ ...job, [propertyName]: formattedDate });
    // }

    const handleSave = () => {
        mutate(job);
        handleClose();
    }

    // const handleTechnologiesChange = (chips: string[]) => {
    //     setJob({ ...job, 'technologies': chips });
    // }

    // const handleTypeChange = (event: SelectChangeEvent<string>) => {
    //     handleChange(event);
    // }
    if (role === "ROLE_ADMIN" || role === "ROLE_USER") {
        return (
            <>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleClickOpen}>New Posting</Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>New Posting</DialogTitle>
                    {/* <JobDialogContent
                        job={job}
                        handleChange={handleChange}
                        handleDateChange={handleDateChange}
                        handleTechnologiesChange={handleTechnologiesChange}
                        handleTypeChange={handleTypeChange} /> */}
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
    else {
        return (
            <>
                <Tooltip title="Register and log in to add new job posting">
                    <span>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            disabled
                            style={{ pointerEvents: 'none', color: 'grey', borderColor: 'grey' }}
                        >New Posting</Button>
                    </span>
                </Tooltip>
            </>
        );
    }
}
export default AddJob;