import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const SplitBillContext = createContext();

export const SplitBillProvider = ({ children }) => {
  const [splitBill, setSplitBill] = useState({});

  const updateSplitBill = (newData) => {
    setSplitBill((prevSplitBill) => ({
      ...prevSplitBill,
      ...newData, 
    }));
  };
  

  const updateMembersSplitBill = (members, totalMember,  SplitBillMethod, splitBillAmount) => {
    if (SplitBillMethod === "Equal Split") {
        const amountToPay = parseFloat((splitBillAmount / totalMember).toFixed(3));
        setSplitBill((prevSplitBill) => ({
            ...prevSplitBill,
            member: totalMember,
            amountToPay: amountToPay,
        }));
    } else {
        const updatedMembers = [];
        members.forEach((member) => {
            let formedMember = { name: member.name, amountToPay: 0, percentage: 0 };

            if (SplitBillMethod === "Split by Percentage") {
                const amountToPay = parseFloat((splitBillAmount * member.percentage / 100).toFixed(3));
                formedMember = { ...formedMember, amountToPay, percentage: Number(member.percentage)};

            } else if (SplitBillMethod === "Split by Order") {
                formedMember = { ...formedMember, amountToPay: parseFloat(Number(member.amountToPay).toFixed(3))};
            }
            updatedMembers.push(formedMember);
        });
        setSplitBill((prevSplitBill) => ({
            ...prevSplitBill,
            members: updatedMembers,
        }));
    }
  };

  const clearSplitBill = () => {
    setSplitBill({});
};

  return (
    <SplitBillContext.Provider value={{ splitBill, updateSplitBill, updateMembersSplitBill, clearSplitBill }}>
      {children}
    </SplitBillContext.Provider>
  );
};

SplitBillProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
