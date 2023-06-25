import React from 'react';
import "../../css/buttons/outlinedButton.css";


function OutlinedButton({children, onClick}) {
  return (
    <button type="button" className="outlined-button" onClick={onClick}>{children}</button>
  )
}

export default OutlinedButton