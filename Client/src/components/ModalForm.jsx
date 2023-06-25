import { useState, useEffect } from "react";
import "../css/modalForm.css";
import "../css/buttons/closeButton.css";
import OutlinedButton from "./buttons/OutlinedButton";
import { FaTimes } from "react-icons/fa";
import { BsPlus } from 'react-icons/bs';
import { useSpring, animated } from 'react-spring';

function ModalForm({ formName, children, openBtnName}) {

  const [isFormVisible, setFormVisibility] = useState(false);

  const slideInAnimation = useSpring({
    transform: isFormVisible ? 'translateY(0)' : 'translateY(-100%)'
  });


  useEffect(() => {
		const handleClickOutside = (e) => {
      if (e.target.nodeName === 'DIALOG') {
        setFormVisibility(false);
      }
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

  return (
    <>
      {isFormVisible && (
          <dialog open>
            <animated.div className="modal" style={slideInAnimation}>
              <div className="modal-header">
                <h2>{formName}</h2>
                <FaTimes className="close" onClick={() => setFormVisibility(false)} />
              </div>
              <div className="form">
                {children}
              </div>
            </animated.div>
          </dialog>
      )}
      <OutlinedButton className="open-modal" onClick={() => setFormVisibility(true)}>{openBtnName}</OutlinedButton>
    </>
  );
}

export default ModalForm;