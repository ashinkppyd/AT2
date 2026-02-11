import { useEffect, useState } from "react";
import api from "../api/api";
import './Addres.css'

const emptyAddress = {
  full_name: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: false,
};

const AddressForm = ({ onSuccess, editAddress }) => {
  const [formData, setFormData] = useState(emptyAddress);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editAddress) setFormData(editAddress);
  }, [editAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editAddress) {
        await api.patch(`addresses/${editAddress.id}/`, formData);
      } else {
        await api.post("addresses/", formData);
      }

      setFormData(emptyAddress);
      onSuccess();
    } catch (err) {
      console.error("Address save failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <h3>{editAddress ? "Update Address" : "Add New Address"}</h3>

      <input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />

      <input name="address_line_1" placeholder="Address Line 1" value={formData.address_line_1} onChange={handleChange} required />
      <input name="address_line_2" placeholder="Address Line 2" value={formData.address_line_2} onChange={handleChange} />

      <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
      <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
      <input name="postal_code" placeholder="Postal Code" value={formData.postal_code} onChange={handleChange} required />

      <label>
        <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} />
        Set as default
      </label>

      <button disabled={loading}>
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
};

export default AddressForm;
