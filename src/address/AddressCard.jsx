import './Addres.css'

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div className={`address-card ${address.is_default ? "default" : ""}`}>
      <p><strong>{address.full_name}</strong></p>
      <p>{address.address_line_1}</p>
      {address.address_line_2 && <p>{address.address_line_2}</p>}
      <p>{address.city}, {address.state} - {address.postal_code}</p>
      <p>{address.phone}</p>

      {address.is_default && <span className="badge">Default</span>}

      <div className="actions">
        <button onClick={() => onEdit(address)}>Edit</button>
        <button onClick={() => onDelete(address.id)} className="danger">Delete</button>
      </div>
    </div>
  );
};

export default AddressCard;
