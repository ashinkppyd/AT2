import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./User.module.css";
import AdNavbar from "./AdNavbar";
import api from "../api/api";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
async function fetchUsers() {
  setLoading(true);
  try {
    const res = await api.get("admin/users/");
    setUsers(res.data || []);
  } catch (err) {
    console.error("Error fetching users:", err);
    setUsers([]);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  fetchUsers();
}, []);

const filteredUsers = users.filter(
  (u) => u.role === "user" || u.role == null
);

async function handleStatus(id, currentStatus) {
  const newStatus = currentStatus === "active" ? "block" : "active";

  try {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: newStatus } : u
      )
    );

    await api.patch(`admin/users/${id}/`, {
      status: newStatus,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    fetchUsers();
  }
}

async function handleRemove(id) {
  const ok = window.confirm("Remove this user permanently?");
  if (!ok) return;

  try {
    await api.delete(`admin/users/${id}/`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  } catch (err) {
    console.error("Error removing user:", err);
  }
}

      
  return (
    <div className={styles.body}>
      <AdNavbar/>
    <div className={styles.container}>
      <h2 className={styles.title}>USER MANAGEMENT</h2>

      {filteredUsers.length === 0 ? (
        <p className={styles.center}>No users found.</p>
      ) : (
        <div className={styles.row}>
          {filteredUsers.map((u) => (
            <div key={u.id} className={styles.userCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.userId}>ID: {u.id} </div>
                  <div className={styles.userName}>userName:{u.username}</div>
                  <div className={styles.userEmail}>Email:{u.email}</div>
                  <div className={styles.roll}>Role:{u.role}</div>
                  <div className={styles.roll}>status:{u.status}</div>
                 
                
                 
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.switchBtn}
                    onClick={() => handleStatus(u.id, u.status)}
                  >
                    {u.status === "active" ? "Block" : "Active"}
                  </button>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(u.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className={styles.cardBody}>
                <span>
                  Status:{" "}
                  <strong
                    className={
                      styles.activeStatus
                        
                    }
                  >
                    {u.status || "—"}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div></div>
  );
}

export default UserManagement;
