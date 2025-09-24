


import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function CGallery() {
  const [albumName, setAlbumName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await axios.get("http://localhost:5226/api/albums");
      setAlbums(res.data);
    } catch (err) {
      console.error("Error fetching albums:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!albumName || !selectedFile) {
      alert("Select/enter album name and choose an image!");
      return;
    }

    const formData = new FormData();
    formData.append("name", albumName);
    formData.append("image", selectedFile);

    try {
      await axios.post("http://localhost:5226/api/albums/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Photo uploaded successfully!");
      setAlbumName("");
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchAlbums();
    } catch (err) {
      console.error(err);
      alert("Error uploading photo.");
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this album and all its photos?")) return;
    try {
      await axios.delete(`http://localhost:5226/api/albums/${albumId}`);
      alert("Album deleted successfully!");
      fetchAlbums();
    } catch (err) {
      console.error(err);
      alert("Error deleting album.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.uploadBox}>
        <h3 style={styles.uploadTitle}>Create Post</h3>

        <div style={styles.inputRow}>
          <select
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            style={styles.select}
          >
            <option value="">Select existing album...</option>
            {albums.map((album) => (
              <option key={album.id} value={album.name}>
                {album.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            placeholder="Or enter new album name..."
            style={styles.input}
          />
        </div>

        <div style={styles.fileRow}>
          <label style={styles.fileLabel}>
            + Add Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {previewUrl && (
          <div style={styles.previewContainer}>
            <img src={previewUrl} alt="Preview" style={styles.previewImage} />
          </div>
        )}

        <div style={styles.footer}>
          <button type="submit" style={styles.button}>
            Post
          </button>
        </div>
      </form>

      {/* Albums Section */}
      <div style={styles.albumSection}>
        <h3 style={styles.sectionTitle}>Albums</h3>
        <div style={styles.albumGrid}>
          {albums.map((album) => (
            <div
              key={album.id}
              style={styles.albumCard}
              className="album-card"
              onClick={() => navigate(`/student/gallery/${album.id}`)}
            >
              <img
                src={
                  album.photos?.[0]
                    ? `http://localhost:5226${album.photos[0].filePath}`
                    : "https://via.placeholder.com/200"
                }
                alt={album.name}
                style={styles.albumThumbnail}
              />
              <div style={styles.albumName}>{album.name}</div>
              <FontAwesomeIcon
                icon={faTrash}
                style={styles.deleteIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAlbum(album.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          .album-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .album-card:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </div>
  );
}

// Styling
const styles = {
  container: {
    marginTop:"90px",
    padding: "30px 60px",
    background: "#f0f2f5",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  uploadBox: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    margin: "0 auto 40px auto",
    maxWidth: 600,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  uploadTitle: {
    margin: "0 0 15px 0",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    borderBottom: "1px solid #eee",
    paddingBottom: 10,
  },
  inputRow: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  select: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 15,
    background: "#fff",
    outline: "none",
  },
  input: {
    width: "97%",
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 15,
    outline: "none",
  },
  fileRow: { marginBottom: 15 },
  fileLabel: {
    display: "inline-block",
    padding: "10px 16px",
    background: "#e7f3ff",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "500",
    fontSize: 14,
    color: "#1877f2",
    border: "1px solid #1877f2",
    transition: "0.2s",
  },
  previewContainer: {
    marginBottom: 15,
    display: "flex",
    justifyContent: "center",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: 300,
    borderRadius: 12,
    objectFit: "cover",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    background: "#1877f2",
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },
  albumSection: { marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
  albumGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20,
  },
  albumCard: {
    position: "relative",
    cursor: "pointer",
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  albumThumbnail: {
    width: "100%",
    height: 180,
    objectFit: "cover",
  },
  albumName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    padding: "10px 0",
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "red",
    background: "#fff",
    borderRadius: "50%",
    padding: 6,
    cursor: "pointer",
    fontSize: 14,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
};
