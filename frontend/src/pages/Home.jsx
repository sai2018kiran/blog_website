import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();

  // Extract keyword from the URL (e.g., ?keyword=react)
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        let url = `${API_BASE_URL}/api/blogs`;
        if (keyword) {
          url = `${API_BASE_URL}/api/blogs/search?keyword=${encodeURIComponent(keyword)}`;
        }

        const res = await axios.get(url);
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [keyword]);

  return (
    <div className="home-container" style={{ marginTop: "80px", padding: "20px" }}>
      <h1>{keyword ? `Search Results for "${keyword}"` : "Latest Blogs"}</h1>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="blog-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {blogs.map((blog) => (
            <div
              className="blog-card"
              key={blog._id}
              style={{
                width: "300px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }}
                />
              )}

              <h2 style={{ fontSize: "1.2rem", marginTop: "10px" }}>{blog.title}</h2>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {blog.content.slice(0, 100)}...
              </p>
              <p style={{ fontSize: "0.8rem", color: "#888" }}>
                <strong>Topic:</strong> {blog.topic}
              </p>

              <Link
                to={`/blogs/${blog._id}`}
                style={{
                  marginTop: "10px",
                  display: "inline-block",
                  color: "#007bff",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
