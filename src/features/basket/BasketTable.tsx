import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";

interface Props {
    items: BasketItem[];
    isBasket?: boolean;
}

export default function BasketTable({items, isBasket = true}: Props) {

    const { status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        {isBasket &&
                        <TableCell align="right"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <TableRow
                            key={item.product.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box display='flex' alignItems='center'>
                                    <img src={item.product.pictureUrl} alt={item.product.name} style={{ height: 50, marginRight: 20 }} />
                                    <span>{item.product.name}</span>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{item.product.price.toFixed(2)} RON</TableCell>
                            <TableCell align="center">
                                {isBasket && <LoadingButton loading={status === 'pendingRemoveItem' + item.product.id + 'rem'}
                                    onClick={() => dispatch(removeBasketItemAsync({
                                        productId: item.product.id,
                                        quantity: 1,
                                        name: 'rem'
                                    }))}
                                    color='error'>
                                    <Remove />
                                </LoadingButton>}
                                {item.quantity}
                                {isBasket && <LoadingButton loading={status === 'pendingAddItem' + item.product.id}
                                    onClick={() => dispatch(addBasketItemAsync({ productId: item.product.id, quantity: 1 }))}
                                    color='secondary'>
                                    <Add />
                                </LoadingButton>}
                            </TableCell>
                            <TableCell align="right">{(item.product.price * item.quantity).toFixed(2)} RON</TableCell>
                            {isBasket && <TableCell align="right">
                                <LoadingButton loading={status === 'pendingRemoveItem' + item.product.id + 'del'}
                                    onClick={() => dispatch(removeBasketItemAsync({
                                        productId: item.product.id,
                                        quantity: item.quantity,
                                        name: 'del'
                                    }))}
                                    color='error'>
                                    <Delete />
                                </LoadingButton>
                            </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}