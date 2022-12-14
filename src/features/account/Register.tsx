import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, AlertTitle, List, ListItem, ListItemText, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import agent from '../../app/api/agent';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

export default function Register() {
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = React.useState<any[]>([]);

    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
    mode: 'all'
});

  return (
      <Container component={Paper} maxWidth="sm" 
                sx={{display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" 
               onSubmit={handleSubmit((data: any) => 
                agent.Account.register({ email: data['email'], password: data['password']})
                             .then(() => {
                                toast.success('Registration successful - you can now log in');
                                navigate('/login');
                             })
                             .catch((error: any) => setValidationErrors([error?.data?.message!])))} noValidate sx={ { mt: 1 }}>
            
            <TextField
              margin="normal"
              fullWidth
              label="Email address"
              autoFocus
              {...register('email', {required: 'Email is required'})}
              error={!!errors.email}
              helperText={errors?.email?.message?.toString()}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register('password', {required: 'Password is required'})}
              error={!!errors.password}
              helperText={errors?.password?.message?.toString()}
            />
            {validationErrors.length > 0 &&
               <Alert severity='error'>
                   <AlertTitle>Validation errors</AlertTitle>
                   <List>
                       {validationErrors.map(error => (
                           <ListItem key={error}>
                               <ListItemText>{error}</ListItemText>
                           </ListItem>
                       ))}
                    </List>
               </Alert>
               }
            <LoadingButton loading={isSubmitting}
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </LoadingButton>
            <Grid container>
              <Grid item>
                <Link to='auth/signup'>
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
  );
}