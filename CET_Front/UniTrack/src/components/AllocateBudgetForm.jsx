// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_EVENTS = "http://localhost:5226/api/events"; // adjust according to your backend
// const API_BUDGET = "http://localhost:5226/api/budget";

// const AllocateBudgetForm = ({ token, onAllocated }) => {
//   const [events, setEvents] = useState([]);
//   const [selectedEventId, setSelectedEventId] = useState("");
//   const [estimatedAmount, setEstimatedAmount] = useState("");
//   const [message, setMessage] = useState("");

//   // Fetch events
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await axios.get(API_EVENTS, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEvents(res.data);
//       } catch (err) {
//         console.error(err);
//         setMessage("Failed to load events");
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedEventId || !estimatedAmount) {
//       setMessage("Please select event and enter amount");
//       return;
//     }

//     try {
//       await axios.post(
//         `${API_BUDGET}/allocate`,
//         { eventId: selectedEventId, estimatedAmount: parseFloat(estimatedAmount) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage("✅ Budget allocated successfully!");
//       onAllocated();
//     } catch (err) {
//       console.error(err);
//       const errMsg = err.response?.data?.message || err.message;
//       setMessage("❌ " + errMsg);
//     }
//   };

//   return (
//     <div>
//       <h3>Allocate Budget</h3>
//       {message && <p>{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Select Event: </label>
//           <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
//             <option value="">-- Select Event --</option>
//             {events.map((ev) => (
//               <option key={ev.id} value={ev.id}>
//                 {ev.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label>Estimated Amount: </label>
//           <input
//             type="number"
//             value={estimatedAmount}
//             onChange={(e) => setEstimatedAmount(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" style={{ marginTop: "10px" }}>
//           Allocate Budget
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AllocateBudgetForm;

