import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useRedirectIfEmptySplitBill = (splitBill) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(splitBill).length === 0 && splitBill.constructor === Object) {
      navigate('/split-bill/method/add/');
    }
  }, [splitBill, navigate]);
};

export default useRedirectIfEmptySplitBill;
