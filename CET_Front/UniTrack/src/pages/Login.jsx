import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import LoginImage from "../assets/login2.jpg"

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Student",
    semester: "",
  });
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setForm({
      username: "",
      email: "",
      password: "",
      role: "Student",
      semester: "",
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isLogin) {
      const res = await axios.post(
        "http://localhost:5226/api/Auth/login",
        {
          username: form.username,
          password: form.password,
        }
      );

      const token = res.data.token;
      localStorage.setItem("token", token);

      const { role } = jwtDecode(token);

      if (role === "Admin") navigate("/admin");
      else if (role === "Coordinator") navigate("/coordinator");
      else navigate("/student");
    } else {
      // Step 1: Register the user
      await axios.post("http://localhost:5226/api/Auth/register", form);

      // Step 2: Automatically login after registration
      const res = await axios.post("http://localhost:5226/api/Auth/login", {
        username: form.username,
        password: form.password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const { role } = jwtDecode(token);
      if (role === "Admin") navigate("/admin");
      else if (role === "Coordinator") navigate("/coordinator");
      else navigate("/student");
    }
  } catch (error) {
    alert(error.response?.data || "Something went wrong");
  }
};


  return (
    <div style={styles.wrapper}>
      <div style={styles.imageSection}>
        <img src={LoginImage}alt="Login" style={styles.image} />
      </div>

      <div style={styles.container}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          {!isLogin && (
            <>
              <input
                style={styles.input}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <select
                style={styles.select}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
                <option value="Coordinator">Coordinator</option>
              </select>

              {form.role === "Student" && (
                <select
                  style={styles.select}
                  value={form.semester}
                  onChange={(e) =>
                    setForm({ ...form, semester: e.target.value })
                  }
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="3rd">3rd Semester</option>
                  <option value="4th">4th Semester</option>
                  <option value="5th">5th Semester</option>
                  <option value="6th">6th Semester</option>
                  <option value="7th">7th Semester</option>
                  <option value="8th">8th Semester</option>
                </select>
              )}
            </>
          )}

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" style={styles.btn}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span style={styles.toggleLink} onClick={toggleForm}>
            {isLogin ? " Sign up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    flexWrap: "wrap",
  },
  imageSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
   
  },
  image: {
    maxWidth: "100%",
    maxHeight: "80vh",
    borderRadius: "10px",
    objectFit: "cover",
     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  container: {
    flex: 1,
    maxWidth: "400px",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.7rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "0.7rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  btn: {
    width: "40%",
    margin: "auto",
    padding: "0.7rem",
    fontSize: "1rem",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  toggleText: {
    marginTop: "1rem",
    textAlign: "center",
  },
  toggleLink: {
    color: "rgb(150, 141, 237)",
    fontSize: "0.9rem",
    cursor: "pointer",
    marginLeft: "0.5rem",
    textDecoration: "underline",
  },
};

export default Login;