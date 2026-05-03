import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/ProductList';
import Login from './components/Login'; // Import nového Loginu
import Cart from './components/Cart';
import ChangePassword from './components/ChangePassword';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import UserOrders from './components/UserOrders';
import BillingProfile from './components/BillingProfile';
import Checkout from './components/Checkout';

function App() {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [cartRefreshKey, setCartRefreshKey] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [activePage, setActivePage] = useState('products');

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

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-3">
                <div className="container-fluid px-4 px-lg-5">
                    <div className="d-flex align-items-center gap-3">
                        <span className="navbar-brand mb-0 h4 text-dark d-flex align-items-center gap-2">
                            <img src="/icon.png" alt="IT-shop" width="28" height="28" className="rounded" />
                            IT-shop
                        </span>
                        {user ? (
                            <div className="d-flex align-items-center gap-2">
                                {isAdmin ? (
                                    <>
                                        <button
                                            className={`btn btn-outline-dark btn-sm ${activePage === 'admin-products' ? 'active' : ''}`}
                                            onClick={() => setActivePage('admin-products')}
                                        >
                                            Sklad
                                        </button>
                                        <button
                                            className={`btn btn-outline-dark btn-sm ${activePage === 'admin-orders' ? 'active' : ''}`}
                                            onClick={() => setActivePage('admin-orders')}
                                        >
                                            Objednávky
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={`btn btn-outline-dark btn-sm ${activePage === 'products' ? 'active' : ''}`}
                                            onClick={() => setActivePage('products')}
                                        >
                                            Produkty
                                        </button>
                                        <button
                                            className={`btn btn-outline-dark btn-sm ${activePage === 'user-orders' ? 'active' : ''}`}
                                            onClick={() => setActivePage('user-orders')}
                                        >
                                            Objednávky
                                        </button>
                                        <button
                                            className={`btn btn-outline-dark btn-sm ${activePage === 'cart' ? 'active' : ''}`}
                                            onClick={() => setActivePage('cart')}
                                        >
                                            Košík
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <button className="btn btn-outline-dark btn-sm" onClick={() => setActivePage('products')}>
                                Produkty
                            </button>
                        )}
                    </div>
                    <div>
                        {user ? (
                            <div className="position-relative">
                                <button
                                    className="btn btn-outline-dark btn-sm"
                                    type="button"
                                    onClick={() => setShowUserMenu((current) => !current)}
                                >
                                    <strong>{user.firstName} {user.lastName}</strong>
                                </button>
                                {showUserMenu && (
                                    <div className="dropdown-menu dropdown-menu-end show shadow-sm" style={{ position: 'absolute', right: 0 }}>
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
                                        {isAdmin && (
                                            <button
                                                className="dropdown-item"
                                                type="button"
                                                onClick={() => setActivePage('admin-products')}
                                            >
                                                Sklad
                                            </button>
                                        )}
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
                            <button className="btn btn-primary btn-sm" onClick={() => setShowLogin(!showLogin)}>
                                {showLogin ? "Zpět na produkty" : "Přihlásit se"}
                            </button>
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
                            <AdminProducts />
                        )}
                        {isAdmin && activePage === 'admin-orders' && (
                            <AdminOrders user={user} />
                        )}
                        {isUser && activePage === 'user-orders' && (
                            <UserOrders user={user} />
                        )}
                        {(isGuest || isUser) && activePage === 'products' && (
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

