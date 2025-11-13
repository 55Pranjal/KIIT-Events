import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const { token, logout } = useAuth();
  const [data, setData] = useState(null);

  const fetchProtected = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/protected`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setData(res.data);
  };

  if (!token) return <p>Please login first.</p>;

  return (
    <div>
      <h1>Home (Protected)</h1>
      <button onClick={logout}>Logout</button>
      <button onClick={fetchProtected}>Fetch Protected Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
