import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Orders } from "../../app/models/order";

export default function Order() {

    const [orders, setOrders] = useState<Orders[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Order.list()
            .then(orders => setOrders(orders))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (<h1> Loading... </h1>)

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Order number</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Order Date</TableCell>
                        <TableCell align="right">Order Status</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell align="right">{row.orderDate}</TableCell>
                            <TableCell align="right">{row.orderStatus}</TableCell>
                            <TableCell align="right">View</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}