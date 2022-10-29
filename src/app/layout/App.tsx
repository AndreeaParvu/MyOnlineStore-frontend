import { useEffect, useState } from 'react';
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
import { getCookie } from '../util/util';
import agent from '../api/agent';
import CheckoutPage from '../../features/checkout/CheckoutPage';
import { useAppDispatch } from '../store/configureStore';
import { setBasket } from '../../features/basket/basketSlice';


function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie('buyerId');
    if (buyerId) {
      agent.Basket.get()
      .then(basket => dispatch(setBasket(basket)))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch])

  const[darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette:{
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  // if (loading) return <Loading>'Initializing app...'</Loading>

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
         </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;