import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync, setBasket } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";
import ProductCard from "./ProductCard";

export default function ProductDetails() {
    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    const {id} = useParams<{id: string | undefined}>();  // il vede ca string deoarece il citeste din URL
    const product = useAppSelector(state => productSelectors.selectById(state, id!));
   
    const{status: productStatus} = useAppSelector(state => state.catalog); // 2 statusuri diferite cu acelasi nume
    const [quantity, setQuantity] = useState(0); //giving it 0 we don't need to specify the kind of state that it is
    const item = basket?.items.find(i => i.product.id === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
        if (!product) dispatch(fetchProductAsync(parseInt(id!)));
}, [id, item, dispatch, product]) //[id] = dependinta ce asigura chemarea componentei o singura data
               // we get the correct quantity value if we select a product that is in a basket
    
function handleInputChange(event : any) {
    if (event.target.value >= 0) {
    setQuantity(parseInt(event.target.value)); //nu poate scadea cantitatea de adaugat in cos sub 1, initial este un string in TextField
    }
}  

function handleUpdateCart() {
    //checking if we have an item and if the local state is greater than the value we are adding
    if (!item || quantity > item.quantity) {
        const updatedQuantity = item ? quantity - item.quantity : quantity;
        dispatch(addBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
    } else {
        const updatedQuantity = item.quantity - quantity;
        dispatch(removeBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
    }
}

if (productStatus.includes('pending')) return <h3>Loading...</h3>

if(!product) return <h3>Product not found</h3>

    return(
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={ProductCard.name} style={{width: '100%'}}/>
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{mb: 2}}/>
                <Typography variant='h4' color='secondary'>{product.price.toFixed(2)} Lei</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity In Stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleInputChange}
                            variant='outlined'
                            type='number'
                            label='Quantity in cart'
                            fullWidth
                            value={quantity} //we can see the quantity if we have the product in the basket
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                        disabled={item?.quantity === quantity || !item && quantity === 0}
                        loading={status.includes('pending')}
                        onClick={handleUpdateCart}
                           sx={{height: '55px'}}
                           color='primary'
                           size='large'
                           variant='contained'
                           fullWidth 
                        > 
                            {item ? 'Update Quantity' : 'Add to Cart'} 
                        </LoadingButton> 
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

