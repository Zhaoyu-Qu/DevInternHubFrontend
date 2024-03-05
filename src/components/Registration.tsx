import { useState } from "react";
import { UserDetails } from "../types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, DialogActions, DialogContent, Stack, TextField } from "@mui/material";

import { useError } from "../ErrorContext";
import axios from "axios";

function Register() {
    const { setErrorMessage } = useError();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<UserDetails>({
        username: '',
        password: ''
    });

    const handleClickOpen = () => {
        setUser({
            username: '',
            password: ''
        });

        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleRegister = async () => {
        try {
            await axios.post(import.meta.env.VITE_API_URL + "/register", user, {
                headers: { 'Content-Type': 'application/json' }
            })
            setErrorMessage(`Congratulations! You have registered as ${user.username}.`);
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data || error.response.status || "")
            } else {
                setErrorMessage("An unknown error occurred.")
            }
        }
        setOpen(false);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    }

    const commonSx = {
        width: { sm: 200, md: 300 },
        "& .MuiInputBase-root": {
            height: 35
        }
    };

    const commonInputLabelProps = { shrink: true };

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleClickOpen}
            >
                Register
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New user</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} mt={1}>
                        <TextField label="Username" name="username" value={user.username} onChange={handleChange}
                            sx={commonSx} InputLabelProps={commonInputLabelProps} placeholder="Username" />
                    </Stack>
                    <Stack spacing={3} mt={1}>
                        <TextField label="Password" name="password" value={user.password} onChange={handleChange}
                            sx={commonSx} InputLabelProps={commonInputLabelProps} placeholder="Password" />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleRegister}>Register!</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Register;