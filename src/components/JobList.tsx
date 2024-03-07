import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, deleteJob, getJobLink } from '../api/jobapi';
import { DataGrid, GridCellParams, GridColDef, GridToolbar } from '@mui/x-data-grid'
import Snackbar from "@mui/material/Snackbar";
import { useAuth } from "../AuthContext";
import AddJob from "./AddJob";
import Login from "./Login";
import { useEffect, useState } from "react";
import EditJob from "./EditJob";
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { Tooltip } from '@mui/material';
import { useError } from '../ErrorContext';
import BookmarkJob from './BookmarkJob';

function JobList() {
    const { errorMessage, setErrorMessage } = useError();
    const { role, username } = useAuth();
    const queryClient = useQueryClient();
    const [displayDeleteMessage, setDisplayDeleteMessage] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
    const { data, isLoading, isError, isSuccess } = useQuery({
        // keep in mind we can extend the queryKey like this, ["jobs", location]
        // and modify the queryFn's signature to receive `location` like this:
        // export const getJobs = async (location: string): ...
        queryKey: ["jobs", role, username],
        queryFn: getJobs
    });

    // whenever the global error state changes and is not empty
    // the error message should show
    useEffect(() => {
        if (errorMessage) { // Check if there is an error message
            setDisplayErrorMessage(true); // Show the Snackbar
        } else {
            setDisplayErrorMessage(false); // Otherwise, don't show it
        }
    }, [errorMessage]); // This effect depends on changes to errorMessage

    const { mutate } = useMutation(deleteJob, {
        onSuccess: () => {
            queryClient.invalidateQueries(["jobs"]);
            setErrorMessage("");
        },
        onError: (err: Error) => {
            console.error(err);
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("An unknown error occurred while deleting the posting.");
            }
        }
    })

    const columns: GridColDef[] = [
        {
            field: 'isBookmarked', headerName: '', width: 10,
            renderCell: (params: GridCellParams) => {
                return (<BookmarkJob jobdata={params.row} />)
            }
        },
        { field: 'companyName', headerName: 'Company', flex: 1 },
        { field: 'title', headerName: 'Title', flex: 3 },
        { field: 'openingDate', headerName: 'Opening Date', flex: 1 },
        { field: 'closingDate', headerName: 'Closing Date', flex: 1 },
        { field: 'location', headerName: 'Location', flex: 1 },
        { field: 'specialisation', headerName: 'Specialisation', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 },
        { field: 'technologies', headerName: 'Tech Stack', flex: 1 },
        {
            field: 'url',
            headerName: 'Url',
            flex: 1,
            renderCell: (params: GridCellParams) => {
                let url = params.row.url;
                if (!/^https?:\/\//i.test(url)) {
                    url = 'http://' + url; // Prepend http:// if missing
                }
                return (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {params.row.url}
                    </a>
                );
            }
        },
        
        {
            field: 'edit',
            headerName: '',
            width: 10,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                const isOwned = params.row.isOwned && !params.row.isVerified;
                const isAdmin = role === "ROLE_ADMIN";
                const canEdit = isOwned || isAdmin;
                return (
                    canEdit ? (

                        <EditJob jobdata={params.row} />

                    ) : null
                );
            }
        },
        {
            field: 'delete',
            headerName: '',
            width: 10,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => {
                const isOwned = params.row.isOwned && !params.row.isVerified;
                const isAdmin = role === "ROLE_ADMIN";
                const canDelete = isOwned || isAdmin;
                return (
                    canDelete ? (
                        <Tooltip title="Delete posting">
                            <span>
                                <IconButton aria-label='delete' size="small"
                                    onClick={
                                        () => {
                                            if (window.confirm(`Are you sure you want to delete ${params.row.title}?`)) {
                                                mutate(getJobLink(params.row.id))
                                            }
                                        }}
                                >
                                    <DeleteIcon fontSize='small' />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ) : null
                );
            }
        }
    ];

    if (isLoading) {
        return <span>Loading...</span>
    } else if (isError) {
        return <span>Error when fetching postings</span>
    } else if (isSuccess) {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
                    <AddJob />
                    <Login />
                </div>
                <DataGrid
                    rows={data}
                    columns={columns}
                    disableRowSelectionOnClick={true}
                    getRowId={row => row.id}
                    slots={{ toolbar: GridToolbar }}
                />
                <Snackbar
                    open={displayDeleteMessage}
                    autoHideDuration={2000}
                    onClose={() => setDisplayDeleteMessage(false)}
                    message="Posting deleted" />
                <Snackbar
                    open={displayErrorMessage}
                    autoHideDuration={2000}
                    onClose={() => { setDisplayErrorMessage(false); setErrorMessage("") }}
                    message={errorMessage} />
            </>
        )
    }
}

export default JobList;