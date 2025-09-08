



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// export default function CGallery() {
//   const [albumName, setAlbumName] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [albums, setAlbums] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchAlbums();
//   }, []);

//   const fetchAlbums = async () => {
//     try {
//       const res = await axios.get("http://localhost:5226/api/albums");
//       setAlbums(res.data);
//     } catch (err) {
//       console.error("Error fetching albums:", err);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreviewUrl(reader.result);
//       reader.readAsDataURL(file);
//     } else setPreviewUrl(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!albumName || !selectedFile) {
//       alert("Enter album name and select an image!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", albumName);
//     formData.append("image", selectedFile);

//     try {
//       await axios.post("http://localhost:5226/api/albums/create", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Photo uploaded successfully!");
//       setAlbumName("");
//       setSelectedFile(null);
//       setPreviewUrl(null);
//       fetchAlbums();
//     } catch (err) {
//       console.error(err);
//       alert("Error uploading photo.");
//     }
//   };

//   const handleDeleteAlbum = async (albumId) => {
//     if (!window.confirm("Are you sure you want to delete this album and all its photos?")) return;
//     try {
//       await axios.delete(`http://localhost:5226/api/albums/${albumId}`);
//       alert("Album deleted successfully!");
//       fetchAlbums();
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting album.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Upload Form */}
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <h2 style={styles.title}>Upload to Album</h2>

//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Album Name:</label>
//           <input
//             type="text"
//             value={albumName}
//             onChange={(e) => setAlbumName(e.target.value)}
//             placeholder="Enter album name"
//             style={styles.input}
//           />
//         </div>

//         <div style={styles.inputGroup}>
//           <label style={styles.label}>Select Image:</label>
//           <input type="file" accept="image/*" onChange={handleFileChange} style={styles.inputFile} />
//         </div>

//         {previewUrl && (
//           <div style={styles.previewContainer}>
//             <p style={{ marginBottom: 5 }}>Preview:</p>
//             <img src={previewUrl} alt="Preview" style={styles.previewImage} />
//           </div>
//         )}

//         <button type="submit" style={styles.button}>Upload</button>
//       </form>

//       {/* Album List */}
//       <div style={styles.albumList}>
//         <h3 style={styles.title}>Albums</h3>
//         {albums.map((album) => (
//           <div key={album.id} style={styles.albumItem}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer" }}
//                  onClick={() => navigate(`/coordinator/gallery/${album.id}`)}>
//               <FontAwesomeIcon icon={faFolder} style={styles.albumIcon} />
//               <span>{album.name}</span>
//             </div>
//             <FontAwesomeIcon
//               icon={faTrash}
//               style={{ color: "red", cursor: "pointer" }}
//               onClick={() => handleDeleteAlbum(album.id)}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Internal CSS
// const styles = {
//   container: { padding: 20, fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", minHeight: "100vh" },
//   form: {
//     padding: 20,
//     margin: "90px auto",
//     background: "#fff",
//     borderRadius: 10,
//     boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//     maxWidth: 500,
//   },
//   title: { textAlign: "center", marginBottom: 15, color: "#333" },
//   inputGroup: { marginBottom: 15, display: "flex", flexDirection: "column" },
//   label: { marginBottom: 5, fontWeight: "bold", color: "#555" },
//   input: { padding: 8, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 },
//   inputFile: { padding: 5, borderRadius: 6, border: "1px solid #ccc" },
//   previewContainer: { textAlign: "center", marginBottom: 15 },
//   previewImage: {
//     width: 200,
//     height: 200,
//     objectFit: "cover",
//     borderRadius: 8,
//     border: "2px solid #ddd",
//   },
//   button: {
//     width: "100%",
//     padding: 10,
//     borderRadius: 8,
//     border: "none",
//     background: "linear-gradient(135deg, #f7971e, #ffd200)",
//     color: "#fff",
//     fontSize: 16,
//     cursor: "pointer",
//   },
//   albumList: {
//     padding: 20,
//     margin: "20px auto",
//     background: "#fff",
//     borderRadius: 10,
//     boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//     maxWidth: 500,
//   },
//   albumItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 10,
//     padding: "10px 0",
//     borderBottom: "1px solid #eee",
//   },
//   albumIcon: { color: "gold", fontSize: 22 },
// };



import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
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
      alert("Select or enter album name and choose an image!");
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
      {/* Upload Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Upload to Album</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Select Album or Enter New:</label>

          <select
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            style={{ ...styles.input, marginBottom: 10 }}
          >
            <option value="">-- Select existing album --</option>
            {albums.map((alb) => (
              <option key={alb.id} value={alb.name}>
                {alb.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            placeholder="Or enter new album name"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Select Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={styles.inputFile} />
        </div>

        {previewUrl && (
          <div style={styles.previewContainer}>
            <p style={{ marginBottom: 5 }}>Preview:</p>
            <img src={previewUrl} alt="Preview" style={styles.previewImage} />
          </div>
        )}

        <button type="submit" style={styles.button}>Upload</button>
      </form>

      {/* Album List */}
      <div style={styles.albumList}>
        <h3 style={styles.title}>Albums</h3>
        {albums.map((album) => (
          <div key={album.id} style={styles.albumItem}>
            <div
              style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer" }}
              onClick={() => navigate(`/student/gallery/${album.id}`)}
            >
              <img
                src={album.photos?.[0] ? `http://localhost:5226${album.photos[0].filePath}` : "https://via.placeholder.com/80"}
                alt={album.name}
                style={styles.albumThumbnail}
              />
              <span>{album.name}</span>
            </div>
            <FontAwesomeIcon
              icon={faTrash}
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => handleDeleteAlbum(album.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Internal CSS
const styles = {
  container: { padding: 20, fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", minHeight: "100vh" },
  form: {
    padding: 20,
    margin: "90px auto",
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    maxWidth: 500,
  },
  title: { textAlign: "center", marginBottom: 15, color: "#333" },
  inputGroup: { marginBottom: 15, display: "flex", flexDirection: "column" },
  label: { marginBottom: 5, fontWeight: "bold", color: "#555" },
  input: { padding: 8, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 },
  inputFile: { padding: 5, borderRadius: 6, border: "1px solid #ccc" },
  previewContainer: { textAlign: "center", marginBottom: 15 },
  previewImage: { width: 200, height: 200, objectFit: "cover", borderRadius: 8, border: "2px solid #ddd" },
  button: { width: "100%", padding: 10, borderRadius: 8, border: "none", background: "linear-gradient(135deg, #f7971e, #ffd200)", color: "#fff", fontSize: 16, cursor: "pointer" },
  albumList: { padding: 20, margin: "20px auto", background: "#fff", borderRadius: 10, boxShadow: "0 5px 15px rgba(0,0,0,0.1)", maxWidth: 500 },
  albumItem: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid #eee" },
  albumThumbnail: { width: 80, height: 80, objectFit: "cover", borderRadius: 8 },
};
