import { useState, useEffect, useContext } from 'react';
import { getSplitBillById } from '../services/controllers/splitBillController';
import { LoadingContext } from '../contexts/LoadingContext';

const useFetchSplitBillbyId = (splitBillId) => {
  const [splitBillData, setSplitBillData] = useState([]);
  const { loading, toggleLoading } = useContext(LoadingContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSplitBillById(splitBillId)
        setSplitBillData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        toggleLoading(false);
      }
    };

    fetchData();
  }, [splitBillId, toggleLoading]);

  return { splitBillData, loading };
};

export default useFetchSplitBillbyId;
