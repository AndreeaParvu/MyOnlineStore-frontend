import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";
import BasketSummary from "./BasketSummary";

export default function BasketPage() {
    const { basket, status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    if (!basket) return <Typography variant='h3'>Your basket is empty!</Typography>

    return (
        <>
<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {basket.items.map(item => (
            <TableRow
              key={item.product.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
               <Box display='flex' alignItems='center'>
                <img src={item.product.pictureUrl} alt={item.product.name} style={{height: 50, marginRight: 20}}/>
                <span>{item.product.name}</span>
                </Box>
              </TableCell>
              <TableCell align="right">{item.product.price.toFixed(2)} RON</TableCell>
              <TableCell align="center">
                <LoadingButton loading={status==='pendingRemoveItem' + item.product.id + 'rem'} 
                            onClick={() => dispatch(removeBasketItemAsync({
                              productId: item.product.id, 
                              quantity: 1,
                              name: 'rem'
                            }))} 
                            color='error'>
                    <Remove />
                </LoadingButton>
                {item.quantity}
                <LoadingButton loading={status==='pendingAddItem' + item.product.id} 
                               onClick={() => dispatch(addBasketItemAsync({productId: item.product.id, quantity: 1}))} 
                               color='secondary'>
                    <Add />
                </LoadingButton>
                </TableCell>
              <TableCell align="right">{(item.product.price * item.quantity).toFixed(2)} RON</TableCell>
              <TableCell align="right">
                <LoadingButton loading={status==='pendingRemoveItem' + item.product.id + 'del'} 
                               onClick={() => dispatch(removeBasketItemAsync({
                                productId: item.product.id, 
                                quantity: item.quantity, 
                                name: 'del'
                              }))} 
                               color='error'>
                    <Delete />
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Grid container>
        <Grid item xs={6}/>
        <Grid item xs={6}>
            <BasketSummary />
            <Button
               component={Link}
               to='/checkout'
               variant='contained'
               size='large'
               fullWidth
            >
              Checkout
            </Button>
        </Grid>
    </Grid>
        </>
    )
}