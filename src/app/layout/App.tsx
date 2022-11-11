import { useCallback, useEffect, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/system";
import { Route } from "react-router";
import { Routes } from 'react-router-dom';
import { ContactPage } from '@mui/icons-material';
import AboutPage from '../../features/about/AboutPage';
import Catalog from '../../features/catalog/Catalog';
import ProductDetails from '../../features/catalog/ProductDetails';
import HomePage from '../../features/home/HomePage';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BasketPage from '../../features/basket/BasketPage';
import CheckoutPage from '../../features/checkout/CheckoutPage';
import { useAppDispatch } from '../store/configureStore';
import { fetchBasketAsync } from '../../features/basket/basketSlice';
import Login from '../../features/account/Login';
import Register from '../../features/account/Register';
import { fetchCurrentUser } from '../../features/account/accountSlice';
import PrivateRoutes from './PrivateRoutes';
import Order from '../../features/orders/Order';


function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  //useCallback => prevents the state to change on every render => 
  // loop of constantly fetching the user & the basket

  const initApp = useCallback(async () => { 
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false))
  }, [initApp]);

  const[darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return (<h1> Loading... </h1>) 

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' hideProgressBar/>
      <CssBaseline/>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Routes>
         <Route path='/' element={<HomePage/>} />
         <Route path='/catalog' element={<Catalog/>} />
         <Route path='/catalog/:id' element={<ProductDetails/>} />
         <Route path='/about' element={<AboutPage/>} />
         <Route path='/contact' element={<ContactPage/>} />
         <Route path='/basket' element={<BasketPage/>}/>
         <Route path='/checkout' element={<CheckoutPage/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Register/>}/>
         <Route element={<PrivateRoutes />}>
             <Route path='/checkout' element={<CheckoutPage />} />
             <Route path='/orders' element={<Order />} />
         </Route>
         </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;