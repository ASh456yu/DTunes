import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import axios from "axios";

function Form({ route, method }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    let [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCSRFtoken = async () => {
            try {
                const response = await axios.get(`${apiUrl}/csrf_token/`, {
                    withCredentials: true
                });
                const token = response.data.csrfToken;
                setCsrfToken(token);
                axios.defaults.headers.common['X-CSRFToken'] = token;
            } catch (error) {
                console.error("Error fetching CSRF token:", error);
            }
        }
        fetchCSRFtoken()
    }, [])
    const name = method === "login" ? "Login" : "Register";
    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post(`${apiUrl}/api/logins/`, {
                username: username,
                password: password
            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            if (response.data.status === "ok") {
                console.log("Login success");
            } else {
                console.log("Login Fail");
            }
        } catch (error) {
            console.log("Login Fail", error);
        }
    };
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username: userName, password: password });
            if (method === "login") {
                handleLogin(userName, password)
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert("Error: " + error.response.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                type="text"
                className="form-input"
                value={userName}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                className="form-input"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;
