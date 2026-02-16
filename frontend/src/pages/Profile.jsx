import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config/api.js";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [blogCount, setBlogCount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          profileImage: res.data.profileImage || "",
        });
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    const fetchBlogCount = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}/blogs/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch blog count", err);
      }
    };

    fetchUser();
    fetchBlogCount();
  }, [userId, token]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/${userId}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      alert("Account deleted");
      navigate("/signup");
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  if (!user) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.profilePicContainer}>
        <img
          src={formData.profileImage || "https://via.placeholder.com/100"}
          alt="Profile"
          style={styles.profileImage}
        />
        <p style={styles.blogCountText}>Blogs written: {blogCount}</p>
      </div>

      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        style={styles.input}
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        style={styles.input}
      />
      <input
        type="text"
        value={formData.profileImage}
        onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
        placeholder="Profile Image URL"
        style={styles.input}
      />

      <button onClick={handleUpdate} style={{ ...styles.button, backgroundColor: "#007bff" }}>
        💾 Save Changes
      </button>

      <Link to="/change-password">
        <button style={{ ...styles.button, backgroundColor: "#f0ad4e" }}>
          🔒 Change Password
        </button>
      </Link>

      <button onClick={handleDelete} style={{ ...styles.button, backgroundColor: "#d9534f" }}>
        🗑️ Delete Account
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px", 
    margin: "80px auto",
    
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column ",
    gap: "15px",
  },
  profilePicContainer: {
    textAlign: "center",
    marginBottom: "10px",
  },
  profileImage: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "6px",
  },
  blogCountText: {
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "15px",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Profile;
