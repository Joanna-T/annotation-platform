import Cookies from "universal-cookie"

const cookies = new Cookies();


export const checkIfAdmin = () => {
    var userGroups = cookies.get("groups")

    if (userGroups === undefined) {
        return false
    }

    if (userGroups.includes("Admin")) {
        return true
    }

    return false
}


export const checkIfCurator = () => {
    var userGroups = cookies.get("groups")
    console.log("checkifcurator", userGroups)

    if (userGroups === undefined) {
        return false
    }

    if (userGroups.includes("Curators")) {
        return true
    }

    return false
}