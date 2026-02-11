import React, { useEffect, useState } from "react";
import "./ProductManagement.css";
import AdNavbar from "./AdNavbar";
import api from "../api/api";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("admin/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
    });
  };


const handleAdd = async () => {
  try {
    let imageUrl = null;

    if (form.image) {
      imageUrl = await uploadToCloudinary(form.image);
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      image: imageUrl,
    };

    const res = await api.post("admin/products/", payload);

    setProducts((prev) => [...prev, res.data]);
    setForm({
      name: "",
      price: "",
      category: "",
      image: "",
      description: "",
    });
  } catch (err) {
    console.error("Error adding product:", err.response?.data);
  }
};



  const handleUpdate = async () => {
    try {
      const res = await api.put(
        `admin/products/${editingProduct}/`,
        form
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct ? res.data : p))
      );
      setEditingProduct(null);
      setForm({ name: "", price: "", category: "", image: "", description: "" });
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      await api.delete(`admin/products/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };
const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "YOUR_UPLOAD_PRESET");
  data.append("cloud_name", "YOUR_CLOUD_NAME");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const result = await res.json();
  return result.secure_url; 
};

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-container" style={{ display: "flex", width: "100%" }}>
      <AdNavbar />

      <div className="productManage">
        <h2 className="headside">Product Management</h2>

        <div className="product-form">
          <input className="boxstyle" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input className="boxstyle" type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
          <input className="boxstyle" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setForm({ ...form, image: e.target.files[0] })
  }
/>

          <input className="boxstyle" name="description" placeholder="Description" value={form.description} onChange={handleChange} />

          {editingProduct ? (
            <button onClick={handleUpdate}>Update Product</button>
          ) : (
            <button onClick={handleAdd}>Add Product</button>
          )}
        </div>

        <div className="product-list">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image} alt={p.name} className="product-img" />
              <div className="product-info">
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>
                <p>{p.category}</p>
                <div className="product-actions">
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ProductManagement;
