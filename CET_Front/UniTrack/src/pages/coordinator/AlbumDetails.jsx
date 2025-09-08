import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const res = await axios.get(`http://localhost:5226/api/albums/${id}`);
      setAlbum(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!album) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 ,    marginTop: "70px"}}>
      <h2>{album.name} - Photos</h2>
      <Link to="/coordinator/gallery" style={{ display: "inline-block", marginBottom: 20 }}>
        ← Back to Albums
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 15,
        }}
      >
        {album.photos && album.photos.length > 0 ? (
          album.photos.map((photo) => (
            <img
              key={photo.id}
              src={`http://localhost:5226${photo.filePath}`}
              alt={photo.fileName}
              style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
            />
          ))
        ) : (
          <p>No photos in this album yet.</p>
        )}
      </div>
    </div>
  );
}


