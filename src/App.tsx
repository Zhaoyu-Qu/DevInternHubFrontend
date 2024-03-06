import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthContext';
import { ErrorProvider } from './ErrorContext';
import JobList from './components/JobList';

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              DevInternHub - A database for CS Students: Internships & Graduate Jobs Portal
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 2, mb: 2, flex: 1 }}>
          <ErrorProvider>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                <JobList />
              </QueryClientProvider>
            </AuthProvider>
          </ErrorProvider>
        </Container>
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
          <Container maxWidth="sm">
            <Typography variant="body1">
              © {new Date().getFullYear()} Zhaoyu Qu. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default App;