import { Authenticator, withAuthenticator, AmplifySignOut, defaultTheme } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"

const SignInPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        checkUser();

    }, [])

    async function checkUser() {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
        window.location.reload();

    }

    if (!user) return null;


    if (user) {
        navigate("/");
    }

    return (
        <div className="signin">
            <h1>Successfully logged in</h1>
            <h2>{user.attributes.email}</h2>
        </div>
    );
}


export default withAuthenticator(SignInPage);
