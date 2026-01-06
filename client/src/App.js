import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useState } from "react";
import Authentication from "./pages/Authentication";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import FoodListing from "./pages/FoodListing";
import Search from "./pages/Search";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { closeSnackbar } from "./redux/reducers/SnackbarSlice";

const Container = styled.div``;

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [openAuth, setOpenAuth] = useState(false);
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <Navbar
            setOpenAuth={setOpenAuth}
            openAuth={openAuth}
            currentUser={currentUser}
          />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/favorite" exact element={<Favourites />} />
            <Route path="/cart" exact element={<Cart />} />
            <Route path="/dishes/:id" exact element={<FoodDetails />} />
            <Route path="/dishes" exact element={<FoodListing />} />
            <Route path="/search" exact element={<Search />} />
            <Route path="/orders" exact element={<Orders />} />
            <Route path="/contact" exact element={<Contact />} />
            {currentUser?.role === "admin" && (
              <>
                <Route path="/admin/dashboard" exact element={<AdminDashboard />} />
                <Route path="/admin/orders" exact element={<AdminOrders />} />
                <Route path="/admin/products" exact element={<AdminProducts />} />
              </>
            )}
          </Routes>
          {openAuth && (
            <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} />
          )}
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => dispatch(closeSnackbar())}
          >
            <Alert
              onClose={() => dispatch(closeSnackbar())}
              severity={severity}
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
