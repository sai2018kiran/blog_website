import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api.js";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [topic, setTopic] = useState("");

  const navigate = useNavigate();
  const topics = ["Technology", "Travel", "Health", "Education", "Finance", "Lifestyle", "World","Nature","Sports"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("You must be logged in to post a blog.");
      return;
    }

    if (!title || !content || !topic) {
      alert("Please fill in all required fields.");
      return;
    }

    const blogData = {
      title,
      content,
      image,
      topic,
      user: userId,  
    };

    console.log("Sending blog data:", blogData);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/blogs`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      });

      console.log("Blog created successfully:", res.data);
      alert("Blog created successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Failed to create blog:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create blog.");
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={topic} onChange={(e) => setTopic(e.target.value)} required>
          <option value="">Select Topic *</option>
          {topics.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>

        <textarea
          placeholder="Content *"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button type="submit">Post Blog</button>
      </form>
    </div>
  );
};

export default CreatePost;
