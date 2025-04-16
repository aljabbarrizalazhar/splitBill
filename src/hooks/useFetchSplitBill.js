import { useState, useEffect, useContext } from 'react';
import { getSplitBillsByUserId } from '../services/controllers/splitBillController';
import { LoadingContext } from '../contexts/LoadingContext';

const useFetchSplitBill = (userId) => {
  const [splitBillData, setSplitBillData] = useState([]);
  const { loading, toggleLoading } = useContext(LoadingContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSplitBillsByUserId(userId)
        setSplitBillData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        toggleLoading(false);
      }
    };

    fetchData();
  }, [userId, toggleLoading]);

  return { splitBillData, loading };
};

export default useFetchSplitBill;
