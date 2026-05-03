import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ProductList from './components/ProductList';
import Login from './components/Login'; // Import nového Loginu
import Cart from './components/Cart';
import ChangePassword from './components/ChangePassword';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import UserOrders from './components/UserOrders';
import BillingProfile from './components/BillingProfile';
import Checkout from './components/Checkout';
import AddProductForm from './components/AddProductForm';

function App() {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [cartRefreshKey, setCartRefreshKey] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [activePage, setActivePage] = useState('products');
    const [cartCount, setCartCount] = useState(0);
    const [adminProductsRefreshKey, setAdminProductsRefreshKey] = useState(0);
    const [adminProductToEdit, setAdminProductToEdit] = useState(null);

    const isAdmin = user?.role === 'ADMIN';
    const isUser = user?.role === 'USER';
    const isGuest = !user;

    useEffect(() => {
        let pageName = 'Produkty';
        if (showLogin && !user) {
            pageName = 'Přihlášení';
        } else if (activePage === 'cart') {
            pageName = 'Košík';
        } else if (activePage === 'checkout') {
            pageName = 'Objednávka';
        } else if (activePage === 'change-password') {
            pageName = 'Změna hesla';
        } else if (activePage === 'profile') {
            pageName = 'Fakturační údaje';
        } else if (activePage === 'admin-products') {
            pageName = 'Sklad';
        } else if (activePage === 'admin-orders') {
            pageName = 'Objednávky';
        } else if (activePage === 'user-orders') {
            pageName = 'Moje objednávky';
        } else if (activePage === 'admin-add-product') {
            pageName = 'Přidat produkt';
        } else if (activePage === 'admin-edit-product') {
            pageName = 'Upravit produkt';
        }
        document.title = `IT-shop | ${pageName}`;
    }, [showLogin, activePage, user]);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setShowLogin(false);
        if (userData?.role === 'ADMIN') {
            setActivePage('admin-products');
        } else {
            setActivePage('products');
        }
    };

    const handleProfileUpdated = (updatedUser) => {
        setUser(updatedUser);
    };

    const handleGoHome = () => {
        setShowLogin(false);
        setActivePage('products');
    };

    const handleShowLogin = () => {
        setShowLogin(true);
    };

    const handleAdminProductSaved = () => {
        setAdminProductsRefreshKey(k => k + 1);
        setActivePage('admin-products');
        setAdminProductToEdit(null);
    };

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
                <div className="container-fluid px-4 px-lg-5">
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            className="navbar-brand mb-0 h4 text-dark d-flex align-items-center gap-2 btn btn-link p-0 text-decoration-none"
                            onClick={handleGoHome}
                        >
                            <img src="/icon.png" alt="IT-shop" width="28" height="28" className="rounded" />
                            IT-shop
                        </button>
                        <ul className="navbar-nav ms-3">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activePage === 'products' && !showLogin ? 'active fw-semibold' : ''}`}
                                    type="button"
                                    onClick={handleGoHome}
                                >
                                    Produkty
                                </button>
                            </li>
                            {isAdmin && (
                                <>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activePage === 'admin-products' ? 'active fw-semibold' : ''}`}
                                            type="button"
                                            onClick={() => setActivePage('admin-products')}
                                        >
                                            Sklad
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activePage === 'admin-orders' ? 'active fw-semibold' : ''}`}
                                            type="button"
                                            onClick={() => setActivePage('admin-orders')}
                                        >
                                            Objednávky
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {isUser && (
                            <button
                                className={`nav-link d-flex align-items-center gap-2 ${activePage === 'cart' ? 'active fw-semibold' : ''}`}
                                type="button"
                                onClick={() => setActivePage('cart')}
                            >
                                <span aria-hidden="true">🛒</span>
                                Košík
                                {cartCount > 0 && (
                                    <span className="badge text-bg-dark rounded-pill">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                        {user ? (
                            <div className="d-flex align-items-center gap-2 position-relative">
                                <span className="fw-semibold">{user.firstName} {user.lastName}</span>
                                <button
                                    className="btn btn-outline-dark btn-sm"
                                    type="button"
                                    onClick={() => setShowUserMenu((current) => !current)}
                                    aria-label="Uživatelské menu"
                                >
                                    ⋯
                                </button>
                                {showUserMenu && (
                                    <div className="dropdown-menu dropdown-menu-end show shadow-sm" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)' }}>
                                        {isUser && (
                                            <button
                                                className="dropdown-item"
                                                type="button"
                                                onClick={() => {
                                                    setActivePage('user-orders');
                                                    setShowUserMenu(false);
                                                }}
                                            >
                                                Moje objednávky
                                            </button>
                                        )}
                                        {isUser && (
                                            <button
                                                className="dropdown-item"
                                                type="button"
                                                onClick={() => {
                                                    setActivePage('profile');
                                                    setShowUserMenu(false);
                                                }}
                                            >
                                                Fakturační údaje
                                            </button>
                                        )}
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() => {
                                                setActivePage('change-password');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            Změna hesla
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item text-danger"
                                            type="button"
                                            onClick={() => {
                                                setUser(null);
                                                setActivePage('products');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            Odhlásit
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            !showLogin && (
                                <button className="btn btn-primary btn-sm" onClick={handleShowLogin}>
                                    Přihlásit se
                                </button>
                            )
                        )}
                    </div>
                </div>
            </nav>

            <main className="container-xxl py-4 flex-grow-1">
                {showLogin && !user ? (
                    <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                    <div>
                        {isUser && activePage === 'cart' && (
                            <Cart
                                user={user}
                                refreshKey={cartRefreshKey}
                                onCartChanged={() => setCartRefreshKey(k => k + 1)}
                                onCheckout={() => setActivePage('checkout')}
                            />
                        )}
                        {isUser && activePage === 'checkout' && (
                            <Checkout
                                user={user}
                                onOrderPlaced={() => setActivePage('user-orders')}
                            />
                        )}
                        {user && activePage === 'change-password' && (
                            <ChangePassword user={user} />
                        )}
                        {user && activePage === 'profile' && (
                            <BillingProfile user={user} onProfileUpdated={handleProfileUpdated} />
                        )}
                        {isAdmin && activePage === 'admin-products' && (
                            <AdminProducts
                                refreshKey={adminProductsRefreshKey}
                                onAddProduct={() => setActivePage('admin-add-product')}
                                onEditProduct={(product) => {
                                    setAdminProductToEdit(product);
                                    setActivePage('admin-edit-product');
                                }}
                            />
                        )}
                        {isAdmin && activePage === 'admin-add-product' && (
                            <AddProductForm
                                mode="create"
                                onProductSaved={handleAdminProductSaved}
                                onCancel={() => setActivePage('admin-products')}
                            />
                        )}
                        {isAdmin && activePage === 'admin-edit-product' && adminProductToEdit && (
                            <AddProductForm
                                mode="edit"
                                initialProduct={adminProductToEdit}
                                onProductSaved={handleAdminProductSaved}
                                onProductDeleted={handleAdminProductSaved}
                                onCancel={() => setActivePage('admin-products')}
                            />
                        )}
                        {isAdmin && activePage === 'admin-orders' && (
                            <AdminOrders user={user} />
                        )}
                        {isUser && activePage === 'user-orders' && (
                            <UserOrders user={user} />
                        )}
                        {(isGuest || isUser || isAdmin) && activePage === 'products' && (
                            <div>
                                <h2 className="fw-light mb-4">Naše nabídka</h2>
                                <ProductList
                                    key={0}
                                    user={user}
                                    onCartChanged={() => setCartRefreshKey(k => k + 1)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>
            <footer className="bg-white border-top py-3 mt-auto">
                <div className="container-xxl text-center text-muted">
                    <small>© 2026 IT-shop · Vytvořeno v rámci předmětu SWI1</small>
                </div>
            </footer>
        </div>
    );
}

export default App;
