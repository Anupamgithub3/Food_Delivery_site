import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAdminOrders, getAllProducts } from "../api";
import { ShoppingBag, People, AttachMoney, RestaurantMenu } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${({ color }) => color + 15};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Section = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0, // Placeholder
    });

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("foodeli-app-token");
            const [ordersRes, productsRes] = await Promise.all([
                getAdminOrders(token),
                getAllProducts()
            ]);

            const orders = ordersRes.data.orders || [];
            const revenue = orders.reduce((acc, order) => acc + (order.total_amount || 0), 0);

            setStats({
                totalOrders: orders.length,
                totalRevenue: revenue,
                totalProducts: productsRes.data.length,
                totalUsers: "N/A", // We'd need a separate API for this
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            <Content>
                <Title>Admin Dashboard</Title>
                <StatsGrid>
                    <StatCard>
                        <StatIcon color="#3f51b5">
                            <ShoppingBag />
                        </StatIcon>
                        <StatInfo>
                            <StatValue>{stats.totalOrders}</StatValue>
                            <StatLabel>Total Orders</StatLabel>
                        </StatInfo>
                    </StatCard>

                    <StatCard>
                        <StatIcon color="#4caf50">
                            <AttachMoney />
                        </StatIcon>
                        <StatInfo>
                            <StatValue>₹{stats.totalRevenue.toFixed(2)}</StatValue>
                            <StatLabel>Total Revenue</StatLabel>
                        </StatInfo>
                    </StatCard>

                    <StatCard>
                        <StatIcon color="#ff9800">
                            <RestaurantMenu />
                        </StatIcon>
                        <StatInfo>
                            <StatValue>{stats.totalProducts}</StatValue>
                            <StatLabel>Dishes on Menu</StatLabel>
                        </StatInfo>
                    </StatCard>

                    <StatCard>
                        <StatIcon color="#f44336">
                            <People />
                        </StatIcon>
                        <StatInfo>
                            <StatValue>{stats.totalUsers}</StatValue>
                            <StatLabel>Active Users</StatLabel>
                        </StatInfo>
                    </StatCard>
                </StatsGrid>

                <Section>
                    <Title style={{ fontSize: '20px' }}>Welcome back, Admin!</Title>
                    <p style={{ color: '#666', marginTop: '10px' }}>
                        From here you can manage your menu items, track customer orders, and monitor your store's performance.
                        Use the navigation below to access specific management tools.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '24px' }}>
                        <a href="/admin/orders" style={{ color: '#be1adb', fontWeight: '600', textDecoration: 'none' }}>→ Manage Orders</a>
                        <a href="/admin/products" style={{ color: '#be1adb', fontWeight: '600', textDecoration: 'none' }}>→ Manage Products</a>
                    </div>
                </Section>
            </Content>
        </Container>
    );
};

export default AdminDashboard;
