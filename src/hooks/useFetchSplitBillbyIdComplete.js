import { useState, useEffect, useContext } from 'react';
import { getSplitBillWithMembersbyId } from '../services/controllers/splitBillController';
import { LoadingContext } from '../contexts/LoadingContext';
import { useNavigate } from 'react-router-dom';

const useFetchSplitBillbyIdComplete = (splitBillId) => {
  const [splitBillData, setSplitBillData] = useState({});
  const { loading, toggleLoading } = useContext(LoadingContext)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSplitBillWithMembersbyId(splitBillId);
        setSplitBillData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.message === "Split Bill tidak ditemukan") {
          navigate("/not-found"); 
        }
      } finally {
        toggleLoading(false);
      }
    };

    fetchData();
  }, [splitBillId, toggleLoading, navigate]);

  return { splitBillData, loading };
};

export default useFetchSplitBillbyIdComplete;
