import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useRefresh = (fn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res.data);
    } catch (error) {
      console.log(`error on refresh`, error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, setData, loading, setLoading, refetch };
};

export default useRefresh;
