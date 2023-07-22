import "../css/inputError.css";
import { useState, useEffect } from "react";

function InputError({ error, isSubmitPressed }) {
  const [isErrorVisible, setErrorVisible] = useState(false);

  function wait(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  
  async function removeErrorDisplay() {
    await wait(10000); 
    setErrorVisible(false);
  }

  useEffect(() => {
    if (error) {
        setErrorVisible(true);
        removeErrorDisplay()
    }
    else {
        setErrorVisible(false);
    }
}, [isSubmitPressed]);

  return (
    <>
      {isErrorVisible  && (
        <div className="input-error" onClick={() => setErrorVisible(false)}>
          <p className="error-message">
            {error}
            <i className="triangle"></i>
          </p>
        </div>
      )}
    </>
  );
}

export default InputError;