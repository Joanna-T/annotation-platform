import React from "react";
import { useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import useWindowSize from "./useWindowSize";


const Navbar = () => {
    const [signedUser, setSignedUser] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [userEmail, setUserEmail] = useState("")
    const size = useWindowSize();
    const location = useLocation()

    useEffect(() => {
        console.log('handle route change here', location)
    }, [location])


    const [currentItem, setCurrentItem] = useState("Home")

    const handleItemClick = (name) => setCurrentItem(name);

    const navigate = useNavigate();
    const signOut = () => {
        Auth.signOut();
        setSignedUser(false);
        navigate("/");
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
            console.log("signed in user", user);
            const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
            console.log("groups", groups);
            setUserEmail(user.attributes.email)
            if (groups) {
                if (groups.includes("Admin")) {
                    setAdmin(true);
                }
            }

            setSignedUser(true);
            console.log("signeduser", signedUser);
        } catch (err) { }
    }


    return (
        <Menu pointing color="blue" inverted size="large" >
            {size.width > 500 ?
                <Menu.Item
                    style={{ top: "0.2em", color: "white" }}>
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
                signedUser && !admin && (
                    <Menu.Item
                        as={Link} to="/annotation_tasks"
                        name='Tasks'
                        active={currentItem === 'Tasks'}
                        onClick={() => handleItemClick('Tasks')}
                    ><Icon name="ellipsis horizontal"></Icon>{size.width > 940 ? "  Tasks" : ""}</Menu.Item>
                )
            }

            {
                signedUser && !admin && (
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
                size.width > 1150 && signedUser &&
                <Menu.Item
                    position="right"
                    style={{ top: "0.2em", color: "white", "padding-right": 0 }}>
                    <h5>{userEmail}</h5>
                </Menu.Item>
            }


            {
                signedUser && (
                    <Menu.Item
                        position={size.width < 1150 ? "right" : ""}
                        name='SignOut'
                        active={currentItem === 'SignOut'}
                        onClick={() => {
                            handleItemClick('SignOut');
                            signOut();
                        }}
                    />
                )
            }

        </Menu>

    )
}

export default Navbar;