import { useEffect, useState } from "react";
import api from "../api/api";
import AddressCard from "./AddressCard";
import AddressForm from "./AddresForm";
import './Addres.css'

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [editAddress, setEditAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("addresses/");
      setAddresses(res.data.results || []); 
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await api.delete(`addresses/${id}/`);
      fetchAddresses();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleSuccess = () => {
    setEditAddress(null);
    fetchAddresses();
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div>
      <AddressForm onSuccess={handleSuccess} editAddress={editAddress} />

      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p>No saved addresses yet.</p>
      ) : (
        <div className="address-list">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={setEditAddress}
              onDelete={deleteAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
