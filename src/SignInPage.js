import { Authenticator, withAuthenticator, AmplifySignOut,defaultTheme } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { AmplifyTheme } from 'aws-amplify-react';
import Amplify from "aws-amplify"
//import awsmobile from "./aws-exports";
//import '@aws-amplify/ui-react/styles.css';
//Amplify.configure(awsmobile);

// const authTheme = {
//     ...AmplifyTheme,
//     sectionHeader:{
//       ...AmplifyTheme.sectionHeader,
//       color:"red",
//     },
//     formSection: {
//       ...AmplifyTheme.formSection,
//       backgroundColor: "green",
//     },
//     sectionFooter: {
//       ...AmplifyTheme.sectionFooter,
//       backgroundColor: "purple"
//     },
//     button: {
//         ...AmplifyTheme.button,
//         backgroundColor: "blue"
//     }
//   }




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
        //window.location.reload();
        navigate("/");
    }
    return(
      <Authenticator loginMechanisms={['username']}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
    )

    return (
        <div className="signin">
            <h1>Successfully logged in</h1>
            <h2>{user.attributes.email}</h2>
        </div>
      );
}
 

//export default SignInPage;
//export default withAuthenticator(Signin);
// export default withAuthenticator(SignInPage, {
//   hideSignUp:true,
// });
export default withAuthenticator(SignInPage);