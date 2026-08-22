import { useEffect, useState } from "react";
import { FiEdit2, FiLogOut, FiMail, FiPlus, FiTrash2 } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const emptyProduct = { name: "", tamilName: "", weight: "", weightLabel: "", price: "", description: "" };

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      sessionStorage.setItem("iniya-admin-token", data.token);
      onLogin(data.token);
    } catch (error) { setError(error.message); } finally { setLoading(false); }
  };

  return <section className="section admin-login"><div className="admin-login-panel">
    <p className="section-eyebrow">Private workspace</p><h1>Admin access</h1>
    <p>Sign in to manage the catalog and order desk.</p>
    <form onSubmit={submit} className="admin-form"><label htmlFor="admin-username">Username</label><input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} autoFocus required /><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {error && <p className="form-error">{error}</p>}<button className="btn btn-primary btn-full" disabled={loading}>{loading ? "Checking..." : "Open dashboard"}</button>
    </form>
  </div></section>;
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("iniya-admin-token"));
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { document.title = "Admin | Iniya Sugar"; }, []);

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers } });
    if (response.status === 401) {
      setToken(null);
      setError("");
      sessionStorage.removeItem("iniya-admin-token");
    }
    const data = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(data?.message || "Request failed");
    return data;
  };

  const loadDashboard = async () => {
    try { const [catalog, orderList] = await Promise.all([fetch(`${API_BASE_URL}/products`).then((response) => response.json()), request("/admin/orders")]); setProducts(catalog); setOrders(orderList); }
    catch (error) {
      if (error.message !== "Admin session expired" && error.message !== "Invalid admin session") {
        setError(error.message);
      }
    }
  };
  useEffect(() => { if (token) loadDashboard(); }, [token]);

  const saveProduct = async (event) => {
    event.preventDefault(); setError("");
    try {
      let image = product.image || "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadResponse = await fetch(`${API_BASE_URL}/products/upload-image`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadData.message || "Image upload failed");
        image = uploadData.image;
      }
      const saved = await request(editingId ? `/products/${editingId}` : "/products", { method: editingId ? "PUT" : "POST", body: JSON.stringify({ ...product, image, price: Number(product.price) }) });
      setProducts((items) => editingId ? items.map((item) => item.id === editingId ? saved : item) : [...items, saved]); setProduct(emptyProduct); setImageFile(null); setEditingId(null); setNotice("Catalog saved");
    }
    catch (error) { setError(error.message); }
  };

  const removeProduct = async (id) => { if (!window.confirm("Remove this product from the catalog?")) return; try { await request(`/products/${id}`, { method: "DELETE" }); setProducts((items) => items.filter((item) => item.id !== id)); } catch (error) { setError(error.message); } };
  const resend = async (id) => { try { await request(`/admin/orders/${id}/resend-email`, { method: "POST" }); setNotice("Order email sent to the admin inbox"); } catch (error) { setError(error.message); } };
  const startEdit = (item) => { setEditingId(item.id); setImageFile(null); setProduct({ ...item, price: String(item.price) }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  if (!token) return <AdminLogin onLogin={setToken} />;
  return <section className="section admin-page"><div className="container">
    <div className="admin-heading"><div><p className="section-eyebrow">Iniya Sugar / control room</p><h1 className="section-title-lg">Admin dashboard</h1></div><button className="btn btn-outline" onClick={() => { sessionStorage.removeItem("iniya-admin-token"); setToken(null); }}><FiLogOut /> Sign out</button></div>
    {notice && <div className="admin-notice">{notice}</div>}{error && <div className="checkout-alert failed">{error}</div>}
    <div className="admin-grid"><div className="admin-panel"><div className="admin-panel-heading"><h2>{editingId ? "Edit product" : "Add product"}</h2>{editingId && <button className="text-button" onClick={() => { setEditingId(null); setProduct(emptyProduct); }}>Cancel</button>}</div>
      <form className="admin-form" onSubmit={saveProduct}><label>Name<input value={product.name} onChange={(event) => setProduct({ ...product, name: event.target.value })} required /></label><label>Tamil name<input value={product.tamilName} onChange={(event) => setProduct({ ...product, tamilName: event.target.value })} /></label><div className="form-row"><label>Weight<input value={product.weight} onChange={(event) => setProduct({ ...product, weight: event.target.value })} required /></label><label>Display weight<input value={product.weightLabel} onChange={(event) => setProduct({ ...product, weightLabel: event.target.value })} required /></label></div><label>Price (INR)<input type="number" min="0" step="1" value={product.price} onChange={(event) => setProduct({ ...product, price: event.target.value })} required /></label><label>Product image<input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files[0] || null)} />{imageFile && <small>{imageFile.name}</small>}</label><label>Description<textarea rows="3" value={product.description} onChange={(event) => setProduct({ ...product, description: event.target.value })} /></label><button className="btn btn-primary"><FiPlus /> {editingId ? "Save changes" : "Add product"}</button></form>
    </div><div className="admin-panel"><div className="admin-panel-heading"><h2>Catalog</h2><span>{products.length} products</span></div><div className="admin-list">{products.map((item) => <div className="admin-list-row" key={item.id}><div><strong>{item.name}</strong><span>{item.weightLabel} / ₹{item.price}</span></div><div className="admin-row-actions"><button className="icon-button" title="Edit product" onClick={() => startEdit(item)}><FiEdit2 /></button><button className="icon-button danger" title="Delete product" onClick={() => removeProduct(item.id)}><FiTrash2 /></button></div></div>)}</div></div></div>
    <div className="admin-panel orders-panel"><div className="admin-panel-heading"><h2>Orders</h2><span>{orders.length} total</span></div>{orders.length === 0 ? <p className="admin-empty">No orders have been recorded yet.</p> : <div className="orders-table-wrap"><table className="orders-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Action</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td><strong>#{String(order._id).slice(-8)}</strong><small>{new Date(order.createdAt).toLocaleString()}</small></td><td>{order.customer.fullName}<small>{order.customer.email}<br />{order.customer.mobile}</small></td><td>{order.items.map((item) => <small key={`${order._id}-${item.id}`}>{item.name} ({item.weight}) x {item.quantity}</small>)}</td><td>₹{order.total}<small>{order.paymentStatus}</small></td><td><button className="btn btn-outline resend-button" onClick={() => resend(order._id)}><FiMail /> Resend</button></td></tr>)}</tbody></table></div>}</div>
  </div></section>;
}
