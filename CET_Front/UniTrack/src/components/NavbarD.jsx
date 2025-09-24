
// const NavbarD = () => {
//   return (
//     <>
//         <header className="header h1">
//         <div className="container header-inner">
//           <div className="logo">
//              <img src="logo.jpg"/>
//             <h1>UniTracker</h1>
//           </div>
//           <div className="nav-buttons">
//             <a href="/login" className="btn-outline">Logout</a>
//           </div>
//         </div>
//       </header>
//     </>
//   )
// }

// export default NavbarD

import React from "react";

const NavbarD = () => {
  const styles = {
    header: {
      height: "70px", // reduced height
      display: "flex",
      alignItems: "center",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 1000,
      padding: "0 20px",
    },
    headerInner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    logoImg: {
      height: "40px",
      width: "auto",
    },
    logoTitle: {
      fontSize: "20px",
      margin: 0,
      color: "#111827",
    },
    navButtons: {},
    logoutBtn: {
      padding: "6px 14px",
      border: "1px solid #2563EB",
      borderRadius: "6px",
          marginRight: "40px",
          border:"1px solid black",
          backgroundColor:"black",
          color:"white",
      textDecoration: "none",
      fontWeight: 500,
      transition: "0.3s",
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        <div style={styles.logo}>
          <img src="logo.jpg" alt="Logo" style={styles.logoImg} />
          <h1 style={styles.logoTitle}>UniTracker</h1>
        </div>
        <div style={styles.navButtons}>
          <a
            href="/login"
            style={styles.logoutBtn}
            // onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563EB") & (e.currentTarget.style.color = "white")}
            // onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent") & (e.currentTarget.style.color = "#2563EB")}
          >
            Logout
          </a>
        </div>
      </div>
    </header>
  );
};

export default NavbarD;

