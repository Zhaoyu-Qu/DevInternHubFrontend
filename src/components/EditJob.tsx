import { useState } from "react";
import { JobForCreation, JobForPatch, JobResponse } from "../types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, DialogActions, IconButton, SelectChangeEvent, Tooltip } from "@mui/material";
import JobDialogContent from "./JobDialogContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJob } from "../api/jobapi";
import EditIcon from '@mui/icons-material/Edit'
import dayjs from "dayjs";
import { useError } from "../ErrorContext";
type FormProps = {
    jobdata: JobResponse;
}

function EditJob({ jobdata }: FormProps) {
    const { setErrorMessage } = useError();
    const queryClient = useQueryClient();
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
    });
    const { mutate } = useMutation(updateJob, {
        onSuccess: () => {
            queryClient.invalidateQueries(["jobs"]);
            setErrorMessage("");
        },
        onError: (err: Error) => {
            console.error(err);
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("An unknown error occurred while editing a new posting.");
            }
        }
    })

    const handleClickOpen = () => {
        setJob({
            title: jobdata.title,
            description: jobdata.description,
            url: jobdata.url,
            location: jobdata.location,
            companyName: jobdata.companyName,
            openingDate: jobdata.openingDate,
            closingDate: jobdata.closingDate,
            specialisation: jobdata.specialisation,
            type: jobdata.type,
            technologies: jobdata.technologies
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = () => {
        const id = jobdata.id;
        const jobForPatch: JobForPatch = { job, id };
        mutate(jobForPatch);
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        setJob({ ...job, [event.target.name]: event.target.value });
    }

    const handleDateChange = (propertyName: string, newValue: dayjs.Dayjs | null) => {
        const formattedDate = newValue ? newValue.format("YYYY-MM-DD") : '';
        setJob({ ...job, [propertyName]: formattedDate });
    }

    const handleTechnologiesChange = (chips: string[]) => {
        setJob({ ...job, 'technologies': chips });
    }

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        handleChange(event);
    }

    return (
        <>
            <Tooltip title="Edit posting">
                <span>
                    <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={handleClickOpen}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit posting</DialogTitle>
                <JobDialogContent
                    job={job}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    handleTechnologiesChange={handleTechnologiesChange}
                    handleTypeChange={handleTypeChange}
                />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EditJob;