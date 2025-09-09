import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
    <div style={styles.albumList}>
      <h2 style={styles.title}>Albums</h2>
      {albums.map((album) => (
        <div key={album.id} style={styles.albumItem}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer" }}
            onClick={() => navigate(`/student/gallery/${album.id}`)}
          >
           <img
  src={`http://localhost:5226${album.photos?.[0]?.filePath}` || "https://via.placeholder.com/80"}
  alt={album.name}
  style={styles.albumThumbnail}
/>

            <span>{album.name}</span>
          </div>
         
        </div>
      ))}
    </div>
  );
}

const styles = {
  albumList: {
    padding: 20,
    margin: "92px auto",
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    maxWidth: 500,
  },
  title: { textAlign: "center", marginBottom: 15, color: "#333" },
  albumItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  albumThumbnail: {
    width: 60,
    height: 60,
    objectFit: "cover",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
};
