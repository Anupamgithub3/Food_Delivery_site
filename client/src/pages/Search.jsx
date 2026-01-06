import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllProducts } from "../api";
import ProductsCard from "../components/cards/ProductsCard";
import { CircularProgress } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: ${({ theme }) => theme.bg};
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

export const SearchBar = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_primary};
  margin: 0 auto;
  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font-size: 16px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;

const Search = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const getProducts = async () => {
        setLoading(true);
        try {
            const res = await getAllProducts(`search=${search}`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                getProducts();
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else if (search.length === 0) {
            getProducts();
        }
    }, [search]);

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <Container>
            <SearchBar>
                <SearchRounded />
                <Input
                    placeholder="Search for food, burgers, pizzas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </SearchBar>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                    <CircularProgress />
                </div>
            ) : (
                <CardWrapper>
                    {products.map((product) => (
                        <ProductsCard key={product._id} product={product} />
                    ))}
                    {products.length === 0 && !loading && (
                        <div style={{ padding: '100px', textAlign: 'center', color: '#666' }}>
                            No products found matching your search.
                        </div>
                    )}
                </CardWrapper>
            )}
        </Container>
    );
};

export default Search;
