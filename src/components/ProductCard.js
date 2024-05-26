import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Carousel from "./Carousel";
import { addToCart } from './js/addToCart.js';
import { exportCart } from './js/exportCart.js';
import { quantityChange } from './js/quantityChange';
import minus from './img/minus.svg';
import plus from './img/plus.svg';
import './All.css'
import favorite from "./img/favorite.svg";

const ProductCard = () => {
    const navigate = useNavigate();
    const params = useParams();
    const productId = params.productId;
    const [product, setProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/ware/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const productData = await response.json();
                setProduct(productData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCart = async () => {
            try {
                const cartData = await exportCart();
                setCartItems(cartData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProduct();
        fetchCart();
    }, [productId]);

    const handleQuantityChange = async (productId, action) => {
        await quantityChange(cartItems, setCartItems, productId, action);
    };

    return (
        <div>
            <Header />
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-6">
                        <img src={product?.image_url} alt={product?.name} className="img-fluid" />
                    </div>
                    <div className="col-md-6">
                        <h1>{product?.name}</h1>
                        <p>Камень: {product?.stone_name} {product?.carat} карат</p>
                        <p>Металл: {product?.metal_name} {product?.purity} пробы</p>
                        <p>Поставщик: {product?.provider_name}</p>
                        <h3>{product?.price} ₽</h3>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            {cartItems.some(item => item.id === product.id && item.count > 0) ? (
                                <div className="d-flex align-items-center">
                                    <img src={minus} width="20" height="20" alt="Minus" className="me-2" onClick={() => handleQuantityChange(product.id, 'decrease')} />
                                    <input id={`quantity-${product.id}`} min="0" name="quantity" value={cartItems.find(item => item.id === product.id).count} type="number" className="form-control ultra-small-select" readOnly />
                                    <img src={plus} width="20" height="20" alt="Plus" className="ms-2" onClick={() => handleQuantityChange(product.id, 'increase')} />
                                </div>
                            ) : (
                                <button className="btn btn-primary" onClick={() => { addToCart(product.id, navigate); window.location.reload(); }}>Добавить в корзину</button>
                            )}
                            <Link to="/Stub" className="btn me-1">
                                <img src={favorite} alt="Избранное" width="20" height="20" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Carousel />
            <Footer />
        </div>
    );
};

export default ProductCard;
