


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CGallery() {
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

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Albums</h2>
      <div style={styles.albumGrid}>
        {albums.map((album) => (
          <div
            key={album.id}
            style={styles.albumCard}
            onClick={() => navigate(`/student/gallery/${album.id}`)}
          >
            <img
              src={
                album.photos?.[0]?.filePath
                  ? `http://localhost:5226${album.photos[0].filePath}`
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={album.name}
              style={styles.albumThumbnail}
            />
            <div style={styles.albumInfo}>
              <span style={styles.albumName}>{album.name}</span>
              <span style={styles.photoCount}>
                {album.photos?.length || 0} Photos
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    marginTop:"90px",
    padding: "40px 80px",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    background: "#f5f6f7",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "25px",
    textAlign: "left",
    color: "#1c1e21",
  },
  albumGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  albumCard: {
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  albumThumbnail: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
  },
  albumInfo: {
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
  },
  albumName: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "5px",
    color: "#050505",
  },
  photoCount: {
    fontSize: "14px",
    color: "#65676b",
  },
};

// Add hover effect
styles.albumCard[":hover"] = {
  transform: "scale(1.03)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};
styles.albumThumbnail[":hover"] = {
  transform: "scale(1.05)",
};
