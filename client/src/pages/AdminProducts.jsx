import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "../api";
import { CircularProgress, Modal, Box, IconButton } from "@mui/material";
import { Add, Edit, Delete, Close } from "@mui/icons-material";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  display: flex;
  flex-direction: column;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const ProductPrice = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const CardActions = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 12px;
`;

const ModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  max-height: 90vh;
  overflow-y: auto;
`;

const AdminProducts = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        img: "",
        price: { org: 0, mrp: 0, off: 0 },
        category: "",
        ingredients: ""
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await getAllProducts();
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            desc: product.desc,
            img: product.img,
            price: { ...product.price },
            category: product.category || "",
            ingredients: product.ingredients?.join(", ") || ""
        });
        setOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const token = localStorage.getItem("foodeli-app-token");
                await deleteProduct(token, id);
                dispatch(openSnackbar({ message: "Product deleted", severity: "success" }));
                fetchProducts();
            } catch (err) {
                dispatch(openSnackbar({ message: "Failed to delete product", severity: "error" }));
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("foodeli-app-token");
            const ingredientsArray = formData.ingredients.split(",").map(i => i.trim());
            const payload = { ...formData, ingredients: ingredientsArray };

            if (editingProduct) {
                await updateProduct(token, editingProduct._id, payload);
                dispatch(openSnackbar({ message: "Product updated", severity: "success" }));
            } else {
                await addProduct(token, [payload]); // Backend expects array for add
                dispatch(openSnackbar({ message: "Product added", severity: "success" }));
            }
            setOpen(false);
            fetchProducts();
        } catch (err) {
            dispatch(openSnackbar({ message: "Failed to save product", severity: "error" }));
        }
    };

    return (
        <Container>
            <Content>
                <Header>
                    <Title>Manage Products</Title>
                    <Button
                        text="Add New Product"
                        leftIcon={<Add />}
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                name: "",
                                desc: "",
                                img: "",
                                price: { org: 0, mrp: 0, off: 0 },
                                category: "",
                                ingredients: ""
                            });
                            setOpen(true);
                        }}
                    />
                </Header>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <ProductGrid>
                        {products.map((product) => (
                            <Card key={product._id}>
                                <ProductImage src={product.img} alt={product.name} />
                                <CardContent>
                                    <ProductName>{product.name}</ProductName>
                                    <ProductPrice>₹{product.price.org}</ProductPrice>
                                    <CardActions>
                                        <Button
                                            small
                                            outlined
                                            text="Edit"
                                            leftIcon={<Edit style={{ fontSize: '16px' }} />}
                                            onClick={() => handleEdit(product)}
                                        />
                                        <Button
                                            small
                                            outlined
                                            type="secondary"
                                            text="Delete"
                                            leftIcon={<Delete style={{ fontSize: '16px' }} />}
                                            onClick={() => handleDelete(product._id)}
                                        />
                                    </CardActions>
                                </CardContent>
                            </Card>
                        ))}
                    </ProductGrid>
                )}

                <Modal open={open} onClose={() => setOpen(false)}>
                    <ModalBox>
                        <Header style={{ marginBottom: '20px' }}>
                            <Title style={{ fontSize: '20px' }}>
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </Title>
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        </Header>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <TextInput
                                label="Product Name"
                                value={formData.name}
                                handelChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <TextInput
                                label="Description"
                                textArea
                                rows={3}
                                value={formData.desc}
                                handelChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                            />
                            <TextInput
                                label="Image URL"
                                value={formData.img}
                                handelChange={(e) => setFormData({ ...formData, img: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <TextInput
                                    label="Price (₹)"
                                    value={formData.price.org}
                                    handelChange={(e) => setFormData({ ...formData, price: { ...formData.price, org: Number(e.target.value) } })}
                                />
                                <TextInput
                                    label="MRP (₹)"
                                    value={formData.price.mrp}
                                    handelChange={(e) => setFormData({ ...formData, price: { ...formData.price, mrp: Number(e.target.value) } })}
                                />
                            </div>
                            <TextInput
                                label="Category"
                                value={formData.category}
                                handelChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                            <TextInput
                                label="Ingredients (comma separated)"
                                value={formData.ingredients}
                                handelChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                            />
                            <Button
                                full
                                text={editingProduct ? "Update Product" : "Add Product"}
                                onClick={handleSubmit}
                            />
                        </div>
                    </ModalBox>
                </Modal>
            </Content>
        </Container>
    );
};

export default AdminProducts;
