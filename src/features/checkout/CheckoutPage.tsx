import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './checkoutValidation';
import agent from '../../app/api/agent';
import { useAppDispatch } from '../../app/store/configureStore';
import { fetchBasketAsync } from '../basket/basketSlice';
import { LoadingButton } from '@mui/lab';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <PaymentForm />;
        case 2:
            return <Review />;
        default:
            throw new Error('Unknown step');
    }
}

const theme = createTheme();

export default function CheckoutPage() {
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });
    const [activeStep, setActiveStep] = React.useState(0);
    const [orderNumber, setOrderNumber] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useAppDispatch();

    const handleNext = async (data: FieldValues) => {
        const { saveAddress, ...shippingAddress } = data;

        if (activeStep === steps.length - 1) {
            setLoading(true);
            try {
                const order = await agent.Order.create({saveAddress, shippingAddress});
                setOrderNumber(order.id);
                setActiveStep(activeStep + 1);
                await dispatch(fetchBasketAsync());
                setLoading(false);
            } catch(error) {
                console.log(error);
                setLoading(false);
            }
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar
                position="absolute"
                color="default"
                elevation={0}
                sx={{
                    position: 'relative',
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                }}
            >

            </AppBar>
            <FormProvider {...methods}>
                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h4" align="center">
                            Checkout
                        </Typography>
                        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Thank you for your order.
                                </Typography>
                                <Typography variant="subtitle1">
                                    Your order number is #{orderNumber}. We have not emailed your order
                                    confirmation, and will not send you an update when your order has
                                    shipped as this is a fake store.
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <form onSubmit={methods.handleSubmit(handleNext)}>
                                {getStepContent(activeStep)}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {activeStep !== 0 && (
                                        <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                            Back
                                        </Button>
                                    )}
                                    <LoadingButton
                                        loading={loading}
                                        disabled={!methods.formState.isValid}
                                        variant="contained"
                                        type='submit'
                                        sx={{ mt: 3, ml: 1 }}
                                    >
                                        {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                    </LoadingButton>
                                </Box>
                            </form>
                        )}
                    </Paper>
                    <Copyright />
                </Container>
            </FormProvider>
        </ThemeProvider>
    );
}