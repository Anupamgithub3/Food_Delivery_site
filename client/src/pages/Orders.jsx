import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrders, getAdminOrders } from "../api";
import { CircularProgress, Switch, FormControlLabel } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;
const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const OrderCard = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 20};
  padding-bottom: 12px;
`;

const OrderId = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const OrderStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #27ae60;
  background: #27ae6020;
  padding: 4px 12px;
  border-radius: 12px;
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + 20};
  margin-top: 8px;
`;

const TotalAmount = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const OrderDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const UserInfo = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 4px;
`;

const Orders = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isAdminView, setIsAdminView] = useState(false);
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("foodeli-app-token");
            if (token) {
                let res;
                if (isAdminView) {
                    res = await getAdminOrders(token);
                } else {
                    res = await getOrders(token);
                }

                console.log('fetchOrders response:', res);
                // Handle different response structures
                let serverOrders = [];
                if (Array.isArray(res.data)) {
                    serverOrders = res.data;
                } else if (res.data && res.data.orders) {
                    serverOrders = res.data.orders;
                }

                // If navigation passed a newly created order, prepend it to the list (avoid duplicates)
                const newOrder = location?.state?.newOrder;
                if (newOrder && !isAdminView) {
                    serverOrders = [newOrder, ...serverOrders.filter((o) => o._id !== newOrder._id)];
                    try {
                        window.history.replaceState({}, document.title);
                    } catch (e) { /* ignore */ }
                }
                setOrders(serverOrders);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [isAdminView]);

    return (
        <Container>
            <Section>
                <TitleContainer>
                    <Title>Your Orders</Title>
                    {currentUser?.role === "admin" && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isAdminView}
                                    onChange={(e) => setIsAdminView(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="View All Platform Orders"
                        />
                    )}
                </TitleContainer>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                        {orders && orders.length > 0 ? (
                            orders.map((order, idx) => {
                                const orderId = order && (order._id || order.id);
                                const idString = orderId ? String(orderId) : null;
                                const displayedId = idString ? `#${idString.slice(-6).toUpperCase()}` : `#${String(idx + 1).padStart(6, '0')}`;
                                return (
                                    <OrderCard key={orderId || idx}>
                                        <OrderHeader>
                                            <OrderId>Order ID: {displayedId}</OrderId>
                                            <OrderStatus>{order?.status || 'Pending'}</OrderStatus>
                                        </OrderHeader>
                                        <OrderDetails>
                                            {isAdminView && order?.user && (
                                                <UserInfo>
                                                    Customer: <b>{order.user.name}</b> ({order.user.email})
                                                </UserInfo>
                                            )}
                                            {(order?.products || []).map((item, index) => (
                                                <ProductItem key={index}>
                                                    <span>
                                                        {item.product?.name ? (
                                                            `${item.product.name} x ${item.quantity || 0}`
                                                        ) : (
                                                            <span style={{ color: '#999', fontStyle: 'italic' }}>
                                                                (Item removed from menu) x {item.quantity || 0}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span>₹{Number((item.product?.price?.org || 0) * (item.quantity || 0)).toFixed(2)}</span>
                                                </ProductItem>
                                            ))}
                                        </OrderDetails>
                                        <OrderFooter>
                                            <OrderDate>Placed on: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}</OrderDate>
                                            <TotalAmount>Total: ₹{Number(order?.total_amount || 0).toFixed(2)}</TotalAmount>
                                        </OrderFooter>
                                    </OrderCard>
                                );
                            })
                        ) : (
                            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                                You haven't placed any orders yet.
                            </div>
                        )}
                    </div>
                )}
            </Section>
        </Container>
    );
};

export default Orders;
