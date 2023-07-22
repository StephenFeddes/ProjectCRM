import { useState, useRef } from "react";
import TextInput from "../TextInput.jsx";
import InputError from "../InputError.jsx";
import { API_URL } from "../../constants.js";
import { useAuth } from "./AuthContext.jsx";
import SimpleButton from "../buttons/SimpleButton.jsx";
import "../../css/loginForm.css";

function LoginForm() {
	const { setIsAuthenticated } = useAuth();
	const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authenticationError, setAuthenticationError] = useState("");
    const [isSubmitPressed, setSubmitPressed] = useState(false);

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(API_URL+"/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: username,
        		password: password
			}),
		});

		const parseRes = await response.json();
		console.log(parseRes);
		localStorage.setItem("token", parseRes.token);
		if (parseRes.token) {
			setIsAuthenticated(true);
		}

		// const validatedInputList = await response.json();
        setSubmitPressed(!isSubmitPressed);
        setAuthenticationError("Username or password is incorrect");
		console.log(username);
		console.log(password);

		} catch (e) {
			console.error(e.message);
		}
	};

	return (
            <form className="login-form">
                <h1>Login</h1>
                <div className="login-details">
                    <InputError error={authenticationError}
                    isSubmitPressed={isSubmitPressed} />
                    <TextInput inputName="Username" onChange={setUsername} isRequired={true} />
                    <TextInput inputName="Password" onChange={setPassword} isRequired={true} />
                </div>
                <div className="login-footer">
                    <SimpleButton type="submit" onClick={onSubmitForm}>Submit</SimpleButton>
                </div>
			</form>
	);
}

export default LoginForm;