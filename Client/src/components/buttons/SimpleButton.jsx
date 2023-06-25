import React from 'react';
import "../../css/buttons/simpleButton.css";


function SimpleButton({children, onClick, color = 'blue'}) {
  return (
    <button type="button" className={color+" simple-button"} onClick={onClick}>{children}</button>
  )
}

export default SimpleButton