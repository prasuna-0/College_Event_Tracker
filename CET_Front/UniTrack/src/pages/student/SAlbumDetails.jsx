


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AlbumDetails() {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`http://localhost:5226/api/albums/${id}`);
        setPhotos(res.data.photos);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPhotos();
  }, [id]);

  const openPhoto = (index) => {
    setSelectedIndex(index);
    setZoom(1); 
  };
  const closePhoto = () => {
    setSelectedIndex(null);
    setZoom(1);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    setZoom(1);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    setZoom(1);
  };

  const zoomIn = (e) => {
    e.stopPropagation();
    setZoom((z) => z + 0.2);
  };
  const zoomOut = (e) => {
    e.stopPropagation();
    setZoom((z) => (z > 0.4 ? z - 0.2 : z));
  };
  const resetZoom = (e) => {
    e.stopPropagation();
    setZoom(1);
  };

  return (
    <div style={{ padding: 20, marginTop: "80px" }}>
      <h2>Album Photos</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 15,
        }}
      >
        {photos.map((photo, index) => (
          <img
            key={photo.id}
            src={`http://localhost:5226${photo.filePath}`}
            alt="album"
            style={{
              width: "100%",
              height: 150,
              objectFit: "cover",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => openPhoto(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closePhoto}
        >
          <div
            style={{
              position: "absolute",
              top: 20,
              display: "flex",
              gap: 10,
              zIndex: 1100,
            }}
          >
            <button
              onClick={zoomOut}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "#1877f2",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <button
              onClick={resetZoom}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "#42b72a",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              onClick={zoomIn}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "#1877f2",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={closePhoto}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "red",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ×
          </button>

          {/* Left arrow */}
          <button
            onClick={prevPhoto}
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 30,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 50,
              height: 50,
              cursor: "pointer",
            }}
          >
            ‹
          </button>

          {/* Right arrow */}
          <button
            onClick={nextPhoto}
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 30,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 50,
              height: 50,
              cursor: "pointer",
            }}
          >
            ›
          </button>

          {/* Image */}
          <img
            src={`http://localhost:5226${photos[selectedIndex].filePath}`}
            alt="full"
            style={{
              maxWidth: "90%",
              maxHeight: "80%",
              borderRadius: 10,
              transform: `scale(${zoom})`,
              transition: "transform 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
