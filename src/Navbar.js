import React from "react";
import { useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";
import {  Authenticator } from "@aws-amplify/ui-react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Icon, Dropdown } from "semantic-ui-react";
import useWindowSize from "./useWindowSize";


const Navbar = () => {
    const [signedUser, setSignedUser] = useState(false); 
    const [admin, setAdmin] = useState(false);
    const size = useWindowSize();
    
    
    const [ currentItem, setCurrentItem ] = useState("Home")

    const handleItemClick = (name) => setCurrentItem(name);

    const navigate = useNavigate();
    const signOut = () => {
        Auth.signOut();
        setSignedUser(false);
        navigate("/");


        // .then(data => console.log(data))
        // .catch(err => console.log(err));
    }

    useEffect(() => {
        authListener();
    }, [])
    
    async function authListener() {
        Hub.listen("auth", (data) => {
            switch (data.payload.event) {
                case "signin":
                    console.log("signed in");
                    return setSignedUser(true);
                case "signout":
                    console.log("signed out");
                    setAdmin(false);
                    return setSignedUser(false);

            }
        })
        try {
            const user = await Auth.currentAuthenticatedUser();
            console.log("user signed in");
            console.log(user);
            const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
            console.log("groups", groups);
            if (groups) {
                if (groups.includes("Admin")) {
                    setAdmin(true);
                }
            }
            
            setSignedUser(true);
            console.log("signeduser", signedUser);
        } catch(err) {}
    }

    //authListener();

    // Hub.listen("auth", (data) => {
    //     switch (data.payload.event) {
    //         case "signin":
    //             return setSignedUser(true);
    //         case "signout":
    //             return setSignedUser(false);
    //     }
    // })


//     return ( 
//  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//   <a className="navbar-brand" href="#">AnnotateIt</a>
//   <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//     <span className="navbar-toggler-icon"></span>
//   </button>
//   <div className="collapse navbar-collapse" id="navbarNav">
//     <ul className="navbar-nav">
//       <li className="nav-item active">
//         <a className="nav-link" href="/">Home </a>
//       </li>
//      {
//           signedUser && (
//          <li className="nav-item">
//             <a className="nav-link" href="/annotation_tasks">Tasks</a>
//         </li>
//           )
//       }
//       {
//           !signedUser && (
//          <li className="nav-item">
//             <a className="nav-link" href="/sign_in">Sign in</a>
//         </li>
//           )
//       }

//     {
//           signedUser && admin && (
//          <li className="nav-item">
//             <a className="nav-link" href="#">Assign tasks</a>
//         </li>
//           )
//       }

//     </ul>

//       {
//           signedUser && (
//             <button onClick={signOut} className="signOutButton">SignOut</button>
    
//           )
//       }
    
    
      
//   </div>
// </nav>

//      );

     return (
        <Menu primary pointing color="blue" inverted size="large" >
            {size.width > 500 ? 
        <Menu.Item
        style={{top:"0.2em", color: "white"}}>
            <h3>AnnotateIt</h3>
        </Menu.Item> : ""
        }
        <Menu.Item
          as={Link} to="/"
          name='Home'
          active={currentItem === 'Home'}
          onClick={() => handleItemClick('Home')}
          ><Icon name="home"></Icon>{size.width > 940 ? "  Home" : ""}</Menu.Item>
        {
            signedUser && !admin &&(
                <Menu.Item
                as={Link} to="/annotation_tasks"
                name='Tasks'
                active={currentItem === 'Tasks'}
                onClick={() => handleItemClick('Tasks')} 
        ><Icon name="ellipsis horizontal"></Icon>{size.width > 940 ? "  Tasks" : ""}</Menu.Item>
            )
        }

        {
            signedUser && !admin &&(
                <Menu.Item
                as={Link} to="/completed_curator_tasks"
                name='CompletedTasks'
                active={currentItem === 'CompletedTasks'}
                onClick={() => handleItemClick('CompletedTasks')} 
                ><Icon name="checkmark"></Icon>{size.width > 940 ? "  Completed Tasks" : ""}</Menu.Item>
            )
        }

        {
            signedUser && admin && (
                    <Menu.Item
                as={Link} to="/assign_tasks"
                name='CreateTasks'
                active={currentItem === 'AssignTask'}
                onClick={() => {
                    handleItemClick('AssignTask');
                    }} 
                    ><Icon name="add"></Icon>{size.width > 940 ? "  Create Tasks" : ""}</Menu.Item>
                
            )
        }

{
            signedUser && admin && (
                    <Menu.Item
                as={Link} to="/reassign_tasks"
                name='ReassignTasks'
                active={currentItem === 'ReassignTask'}
                onClick={() => {
                    handleItemClick('ReassignTask');
                    }} 
                    ><Icon name="undo"></Icon>{size.width > 940 ? "  Reassign Tasks" : ""}</Menu.Item>
                
            )
        }

        {
            signedUser && admin && (
                    <Menu.Item
                as={Link} to="/active_tasks"
                name='ActiveTasks'
                active={currentItem === 'ActiveTasks'}
                onClick={() => {
                    handleItemClick('ActiveTasks');
                    }} 
                    ><Icon name="ellipsis horizontal"></Icon>{size.width > 940 ? "  Active tasks" : ""}</Menu.Item>
                
            )
        }
        {
            signedUser && admin && (
                    <Menu.Item
                as={Link} to="/completed_tasks"
                name='CompletedTasks'
                active={currentItem === 'CompletedTasks'}
                onClick={() => {
                    handleItemClick('CompletedTasks');
                    }} 
                    ><Icon name="checkmark"></Icon>{size.width > 940 ? "  Completed tasks" : ""}</Menu.Item>
                
            )
        }
        
        
        {
            !signedUser && (
                <Menu.Item
                position="right"
                as={Link} to="/sign_in"
                name='SignIn'
                active={currentItem === 'SignIn'}
                onClick={() => handleItemClick('SignIn')} 
        />
            )
        }
        

        {
            signedUser && (
                <Menu.Item
                position="right"
                name='SignOut'
                active={currentItem === 'SignOut'}
                onClick={() => {
                    handleItemClick('SignOut');
                    signOut();}} 
                    />
            )
        }

      </Menu>

     )
}
 
export default Navbar;