import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Process from "./pages/Process";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Achievements from "./pages/Achievements";
import { useCart } from "./context/CartContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ToastNotification() {
  const { toast } = useCart();
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/process" element={<Process />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route
            path="*"
            element={
              <div className="section container not-found">
                <h2>404 — Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastNotification />
      <Analytics />
    </div>
  );
}
