/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";

const useFetch = (url) => {
  const { token, logout } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await fetch(url, { headers });
        if (response.status === 401) {
          logout();
          return;
        }
        if (!response.ok) {
          throw new Error("Fetch failed");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [url, token]);
  return { data, error };
};
export { useFetch };
