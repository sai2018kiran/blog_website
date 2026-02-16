// src/pages/Topics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api.js";

const Topics = () => {
  const [groupedBlogs, setGroupedBlogs] = useState({});

  useEffect(() => {
    const fetchGroupedBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/blogs/topics`);
        setGroupedBlogs(res.data);
      } catch (error) {
        console.error("Failed to fetch blogs by topic", error);
      }
    };
    fetchGroupedBlogs();
  }, []);

  return (
    <div className="topics-container" style={{ marginTop: "80px", padding: "20px" }}>
      <h2>Blogs by Topic</h2>
      {Object.keys(groupedBlogs).map((topic) => (
        <div key={topic} style={{ marginBottom: "30px" }}>
          <h3>{topic}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {groupedBlogs[topic].map((blog) => (
              <Link to={`/blogs/${blog._id}`} key={blog._id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "250px",
                  borderRadius: "10px",
                  background: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}>
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px"
                      }}
                    />
                  )}
                  <h4>{blog.title}</h4>
                  <p>{blog.content.slice(0, 80)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Topics;
