import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import Login from './components/Login'; // Import nového Loginu
import Cart from './components/Cart';
import ChangePassword from './components/ChangePassword';

function App() {
    const [user, setUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [cartRefreshKey, setCartRefreshKey] = useState(0);

    useEffect(() => {
        const pageName = showLogin && !user ? 'Přihlášení' : 'Produkty';
        document.title = `IT-shop | ${pageName}`;
    }, [showLogin, user]);

    return (
        <div className="min-vh-100 bg-light pb-5">
            <nav className="navbar navbar-dark bg-dark mb-4 shadow">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">IT-shop</span>
                    <div>
                        {user ? (
                            <div className="text-light">
                                <span className="me-3">Ahoj, <strong>{user.username}</strong></span>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => setUser(null)}>Odhlásit</button>
                            </div>
                        ) : (
                            <button className="btn btn-primary btn-sm" onClick={() => setShowLogin(!showLogin)}>
                                {showLogin ? "Zpět na produkty" : "Přihlásit se"}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container">
                {showLogin && !user ? (
                    <Login onLoginSuccess={(userData) => {setUser(userData); setShowLogin(false);}} />
                ) : (
                    <div className="row">
                        <div className={user ? "col-lg-8" : "col-12"}>
                            <h2 className="fw-light mb-4">Naše nabídka</h2>
                            <ProductList
                                key={refreshKey}
                                user={user}
                                onCartChanged={() => setCartRefreshKey(k => k + 1)}
                            />
                        </div>

                        {user && (
                            <div className="col-lg-4">
                                {user?.role === 'ADMIN' && (
                                    <AddProductForm onProductAdded={() => setRefreshKey(k => k + 1)} />
                                )}
                                <ChangePassword user={user} />
                                <Cart user={user} refreshKey={cartRefreshKey} onCartChanged={() => setCartRefreshKey(k => k + 1)} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <footer className="text-center text-muted py-4 mt-5 border-top">
                <small>© 2026 IT-shop · Vytvořeno v rámci předmětu SWI1</small>
            </footer>
        </div>
    );
}

export default App;