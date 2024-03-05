import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { jwtDecode } from 'jwt-decode';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useError } from '../ErrorContext';
import Register from './Registration';
type User = {
    username: string;
    password: string;
}
function Login() {
    const { setErrorMessage } = useError();
    const { setRole, setUsername, role, username } = useAuth();
    const [user, setUser] = useState<User>({
        username: '',
        password: ''
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user, [event.target.name]: event.target.value
        })
    }

    const handleLogin = async () => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + "/login", user, {
                headers: { 'Content-Type': 'application/json' }
            })
            const jwtToken = response.headers.authorization;
            const decoded = jwtDecode<{ sub: string; role: string }>(jwtToken);
            if (decoded) {
                setRole(decoded.role);
                setUsername(decoded.sub);
                sessionStorage.setItem("jwt", jwtToken);
                sessionStorage.setItem("role", decoded.role);
                sessionStorage.setItem("username", decoded.sub);
            } else {
                handleLogout();
            }
        } catch (error) {
            handleLogout();
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data || error.response.status || "")
            } else {
                setErrorMessage("An unknown error occurred.")
            }
        }
    }

    const handleLogout = async () => {
        sessionStorage.removeItem("jwt");
        setRole("ROLE_GUEST");
        setUsername("");
    }

    if (role !== "ROLE_ADMIN" && role !== "ROLE_USER") {
        return (
            <>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Register />
                    <Divider orientation='vertical' flexItem sx={{ mx: 1, height: 'auto' }} />
                    <TextField
                        name="username"
                        label="Username"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            width: { sm: 200, md: 100 },
                            "& .MuiInputBase-root": {
                                height: 30
                            }
                        }}
                        onChange={handleChange} />
                    <TextField
                        type="password"
                        name="password"
                        label="Password"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            width: { sm: 200, md: 100 },
                            "& .MuiInputBase-root": {
                                height: 30
                            }
                        }}
                        onChange={handleChange} />
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={handleLogin}>
                        Login
                    </Button>
                </Stack>
            </>
        )
    }
    else {
        return (<>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body1">
                    Welcome, {username}
                </Typography>
                <Divider orientation='vertical' flexItem sx={{ mx: 1, height: 'auto' }} />
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleLogout}>
                    Logout
                </Button>
            </Stack>
        </>);
    }
}

export default Login;