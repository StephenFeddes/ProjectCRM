import React from 'react';
import "../css/buttons/closeButton.css";
import { FaTimes } from "react-icons/fa";


function CloseButton({ onClick }) {
  return <FaTimes className="close" onClick={onClick} />
}

export default CloseButton