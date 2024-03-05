import { JobResponse } from "../types";
import { IconButton } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkJob } from "../api/jobapi";
import { useError } from "../ErrorContext";
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useAuth } from "../AuthContext";
type FormProps = {
    jobdata: JobResponse;
}

function BookmarkJob({ jobdata }: FormProps) {
    const { role } = useAuth();
    const { setErrorMessage } = useError();
    const queryClient = useQueryClient();

    const { mutate } = useMutation(bookmarkJob, {
        onSuccess: () => {
            queryClient.invalidateQueries(["jobs"]);
            setErrorMessage("Posting bookmarked.");
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

    const handleClick = () => {
        // check login status, if not logged in, prompt that you have to login
        if (role !== "ROLE_ADMIN" && role !== "ROLE_USER") {
            setErrorMessage("Log in to bookmark this posting!");
        } else {
            if (jobdata.isBookmarked)
                mutate({
                    isBookmarked: false,
                    id: jobdata.id
                })
            else
                mutate({
                    isBookmarked: true,
                    id: jobdata.id
                })
        }
    }

    if (jobdata.isBookmarked) {
        return (
            <>
                <IconButton
                    aria-label="bookmark"
                    size="small"
                    onClick={handleClick}>
                    <StarIcon fontSize="small" />
                </IconButton>
            </>
        )
    } else {
        return (
            <>
                <IconButton
                    aria-label="bookmark"
                    size="small"
                    onClick={handleClick}>
                    <StarBorderIcon fontSize="small" />
                </IconButton>
            </>
        )
    }
}

export default BookmarkJob;