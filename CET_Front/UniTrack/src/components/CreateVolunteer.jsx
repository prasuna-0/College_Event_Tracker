
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const VolunteerPage = () => {
//   const [studentId, setStudentId] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [volunteers, setVolunteers] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editingName, setEditingName] = useState("");

//   // Load volunteers
//   const fetchVolunteers = async () => {
//     try {
//       const response = await axios.get("http://localhost:5226/api/Volunteer", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setVolunteers(response.data);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to load volunteers ❌");
//     }
//   };

//   useEffect(() => {
//     fetchVolunteers();
//   }, []);

//   // Create volunteer
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!studentId) {
//       setMessage("Please enter a Student ID.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       await axios.post(
//         "http://localhost:5226/api/Volunteer",
//         { studentId: parseInt(studentId) },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setMessage("Volunteer created ✅");
//       setStudentId("");
//       fetchVolunteers(); // refresh list
//     } catch (err) {
//       console.error(err);
//       setMessage(err.response?.data?.error || "Failed to create volunteer ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete volunteer
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this volunteer?")) return;

//     try {
//       await axios.delete(`http://localhost:5226/api/Volunteer/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setMessage("Volunteer deleted ✅");
//       fetchVolunteers();
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to delete volunteer ❌");
//     }
//   };

//   // Start editing
//   const startEditing = (id, name) => {
//     setEditingId(id);
//     setEditingName(name);
//   };

// const handleEditSave = async (id) => {
//   const volunteer = volunteers.find(v => v.id === id);
//   try {
//     await axios.put(
//       `http://localhost:5226/api/Volunteer/${id}`,
//       { studentId: volunteer.sid, name: editingName },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     setMessage("Volunteer updated ✅");
//     setEditingId(null);
//     fetchVolunteers();
//   } catch (err) {
//     console.error(err);
//     setMessage("Failed to update volunteer ❌");
//   }
// };


//   // Cancel editing
//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditingName("");
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "700px",
//         margin: "30px auto",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       {/* Card 1: Create Volunteer */}
//       <div
//         style={{
//           padding: "20px",
//           borderRadius: "12px",
//           backgroundColor: "#fff",
//           boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//           marginBottom: "30px",
//         }}
//       >
//         <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
//           Create Volunteer
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "15px" }}>
//             <label
//               style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
//             >
//               Enter Student ID
//             </label>
//             <input
//               type="number"
//               value={studentId}
//               onChange={(e) => setStudentId(e.target.value)}
//               placeholder="Enter Student ID"
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 border: "1px solid #ccc",
//                 borderRadius: "6px",
//               }}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: "100%",
//               padding: "10px",
//               backgroundColor: loading ? "#999" : "#007bff",
//               color: "#fff",
//               border: "none",
//               borderRadius: "6px",
//               cursor: loading ? "not-allowed" : "pointer",
//               fontWeight: "600",
//             }}
//           >
//             {loading ? "Creating..." : "Create Volunteer"}
//           </button>
//         </form>

//         {message && (
//           <p
//             style={{
//               marginTop: "15px",
//               textAlign: "center",
//               fontWeight: "500",
//               color: message.includes("✅") ? "green" : "red",
//             }}
//           >
//             {message}
//           </p>
//         )}
//       </div>

//       {/* Card 2: Volunteer List */}
//       <div
//         style={{
//           padding: "20px",
//           borderRadius: "12px",
//           backgroundColor: "#fff",
//           boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         <h3 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "bold" }}>
//           List of Volunteers
//         </h3>

//         {volunteers.length > 0 ? (
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               textAlign: "left",
//             }}
//           >
//             <thead>
//               <tr style={{ backgroundColor: "#f5f5f5" }}>
//                 <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
//                   Student ID
//                 </th>
//                 <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
//                   Name
//                 </th>
//                 <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {volunteers.map((v) => (
//                 <tr key={v.id}>
//                   <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
//                     {v.sid}
//                   </td>
//                   <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
//                     {editingId === v.id ? (
//                       <input
//                         type="text"
//                         value={editingName}
//                         onChange={(e) => setEditingName(e.target.value)}
//                         style={{ padding: "6px", width: "90%" }}
//                       />
//                     ) : (
//                       v.name
//                     )}
//                   </td>
//                   <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
//                     {editingId === v.id ? (
//                       <>
//                         <button
//                           onClick={() => handleEditSave(v.id)}
//                           style={{
//                             marginRight: "8px",
//                             padding: "5px 10px",
//                             backgroundColor: "#28a745",
//                             color: "#fff",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={handleCancelEdit}
//                           style={{
//                             padding: "5px 10px",
//                             backgroundColor: "#6c757d",
//                             color: "#fff",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button
//                           onClick={() => startEditing(v.id, v.name)}
//                           style={{
//                             marginRight: "8px",
//                             padding: "5px 10px",
//                             backgroundColor: "#ffc107",
//                             color: "#000",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(v.id)}
//                           style={{
//                             padding: "5px 10px",
//                             backgroundColor: "#dc3545",
//                             color: "#fff",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Delete
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No volunteers found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VolunteerPage;


import React, { useState, useEffect } from "react";
import axios from "axios";

const VolunteerPage = () => {
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      const response = await axios.get("http://localhost:5226/api/Volunteer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVolunteers(response.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load volunteers ❌");
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Create volunteer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) {
      setMessage("Please enter a Student ID.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:5226/api/Volunteer",
        { studentId: parseInt(studentId) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Volunteer created ✅");
      setStudentId("");
      fetchVolunteers(); // refresh list
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to create volunteer ❌");
    } finally {
      setLoading(false);
    }
  };

  // Delete volunteer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) return;

    try {
      await axios.delete(`http://localhost:5226/api/Volunteer/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Volunteer deleted ✅");
      setVolunteers(volunteers.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete volunteer ❌");
    }
  };

  // Start editing
  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  // Save edited name
 const handleEditSave = async (id) => {
  const volunteer = volunteers.find(v => v.id === id);
  try {
    const response = await axios.put(
      `http://localhost:5226/api/Volunteer/${id}`,
      { studentId: volunteer.sid, name: editingName },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // update frontend state using response.data
    setVolunteers(volunteers.map(v => v.id === id ? response.data : v));

    setEditingId(null);
    setEditingName("");
    setMessage("Volunteer updated ✅");
  } catch (err) {
    console.error(err);
    setMessage("Failed to update volunteer ❌");
  }
};


  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Create Volunteer Card */}
      <div
        style={{
          marginTop:"100px",
          padding: "20px",
          borderRadius: "12px",

          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
          Create Volunteer
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
            >
              Enter Student ID
            </label>
            <input
              type="number"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter Student ID"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: loading ? "#999" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
            }}
          >
            {loading ? "Creating..." : "Create Volunteer"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              fontWeight: "500",
              color: message.includes("✅") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* Volunteer List Card */}
      <div
        style={{
          margin:"50px auto",
          padding: "20px",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "bold" }}>
          List of Volunteers
        </h3>

        {volunteers.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
                  Student ID
                </th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
                  Name
                </th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {v.sid}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {editingId === v.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        style={{ padding: "6px", width: "90%" }}
                      />
                    ) : (
                      v.name
                    )}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                    {editingId === v.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(v.id)}
                          style={{
                            marginRight: "8px",
                            padding: "5px 10px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(v.id, v.name)}
                          style={{
                            marginRight: "8px",
                            padding: "5px 10px",
                            backgroundColor: "#ffc107",
                            color: "#000",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No volunteers found.</p>
        )}
      </div>
    </div>
  );
};

export default VolunteerPage;


