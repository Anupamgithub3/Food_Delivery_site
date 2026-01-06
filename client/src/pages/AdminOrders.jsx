import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAdminOrders, updateOrderStatus } from "../api";
import { CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

const Container = styled.div`
  padding: 30px;
  background: ${({ theme }) => theme.bg};
  min-height: 100vh;
  padding-bottom: 200px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 16px;
  background: ${({ theme }) => theme.primary + 10};
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const Td = styled.td`
  padding: 16px;
  color: ${({ theme }) => theme.text_primary};
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 10};
  font-size: 14px;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) =>
        status === "Delivered" ? "#27ae6020" :
            status === "Delivering" ? "#2f80ed20" :
                "#f2994a20"};
  color: ${({ status }) =>
        status === "Delivered" ? "#27ae60" :
            status === "Delivering" ? "#2f80ed" :
                "#f2994a"};
`;

const AdminOrders = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("foodeli-app-token");
            const res = await getAdminOrders(token);
            setOrders(res.data.orders || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("foodeli-app-token");
            await updateOrderStatus(token, orderId, { status: newStatus });
            dispatch(openSnackbar({ message: "Status updated", severity: "success" }));
            fetchOrders();
        } catch (err) {
            dispatch(openSnackbar({ message: "Failed to update status", severity: "error" }));
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Container>
            <Content>
                <Title>Manage Orders</Title>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>Order ID</Th>
                                    <Th>Customer</Th>
                                    <Th>Items</Th>
                                    <Th>Amount</Th>
                                    <Th>Date</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <Td>#{order._id.slice(-6).toUpperCase()}</Td>
                                        <Td>
                                            <div style={{ fontWeight: 600 }}>{order.user?.name || "Deleted User"}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{order.user?.email}</div>
                                        </Td>
                                        <Td>
                                            {order.products?.map((p, idx) => (
                                                <div key={idx}>{p.product?.name} x {p.quantity}</div>
                                            ))}
                                        </Td>
                                        <Td>₹{order.total_amount?.toFixed(2)}</Td>
                                        <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                                        <Td>
                                            <StatusBadge status={order.status}>{order.status}</StatusBadge>
                                        </Td>
                                        <Td>
                                            <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                <Select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    style={{ fontSize: '13px' }}
                                                >
                                                    <MenuItem value="Payment Done">Payment Done</MenuItem>
                                                    <MenuItem value="Delivering">Delivering</MenuItem>
                                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableWrapper>
                )}
            </Content>
        </Container>
    );
};

export default AdminOrders;
