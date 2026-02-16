// src/pages/BlogDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
        setBlog(res.data);
        setFormData({
          title: res.data.title,
          content: res.data.content,
          topic: res.data.topic,
          image: res.data.image,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Blog deleted successfully.");
      navigate("/");
    } catch (err) {
      alert("Delete failed: " + err.response?.data?.message || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/blogs/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Blog updated!");
      setIsEditing(false);
    } catch (err) {
      alert("Update failed: " + err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div style={{ marginTop: "100px", textAlign: "center" }}>Loading...</div>;
  if (!blog) return <div style={{ marginTop: "100px", textAlign: "center" }}>Blog not found.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "100px auto", padding: "20px" }}>
      {isEditing ? (
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Title"
            required
          />
          <input
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="Topic"
            required
          />
          <input
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="Image URL"
          />
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            required
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{ background: "#4CAF50", color: "white", padding: "10px", border: "none", cursor: "pointer" }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{ background: "#999", color: "white", padding: "10px", border: "none", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1>{blog.title}</h1>
          <p>
            <strong>Topic:</strong> {blog.topic}
          </p>
          <p>
            <strong>Author:</strong> {blog.user?.name || "Unknown"} | <strong>Date:</strong>{" "}
            {new Date(blog.createdAt).toLocaleString()}
          </p>
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "10px" }}
            />
          )}
          <p style={{ whiteSpace: "pre-line", marginTop: "20px" }}>{blog.content}</p>

          {(blog.user === currentUserId || blog.user?._id === currentUserId) && (
            <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: "#007BFF",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                style={{
                  background: "#DC3545",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogDetails;
