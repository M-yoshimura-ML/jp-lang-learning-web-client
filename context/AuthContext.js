import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode"
import { useRouter } from 'next/router';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    let [authToken, setAuthTokens] = useState(null);
    let [user, setUser] = useState(null);
    let [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken')
        setAuthTokens(authToken ? JSON.parse(localStorage.getItem('authToken')): null)
        setUser(authToken ? jwtDecode(localStorage.getItem('authToken')): null)
        setIsAdmin(authToken ? jwtDecode(localStorage.getItem('authToken'))['isSuperuser']: false)
    },[]);

    useEffect(() => {

        let TenMinutes = 1000 * 60 * 10
        let interval = setInterval(()=> {
            if(authToken){
                updateToken()
            }
        },TenMinutes)
        return () => clearInterval(interval)
    },[authToken]);
    
    
    const router = useRouter();

    let loginUser = async(e) => {
        e.preventDefault();
        console.log('form submitted');

        let response = await fetch(
            `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/token/`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value }),
            }
        );
        let data = await response.json();
        // console.log('data', data);
        // console.log('response', response);
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            setIsAdmin(jwtDecode(data.access)['isSuperuser']);
            localStorage.setItem('authToken', JSON.stringify(data))
            router.push('/');
            
        } else {
            alert('something went wrong');
        }
    }

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('authToken');
        router.push('/login');
    }

    let updateToken = async() => {
        console.log('update token is called')
        let response = await fetch(
            `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/token/refresh/`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({ 'refresh': authToken?.refresh }),
            }
        );
        let data = await response.json();

        if(response.status===200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            setIsAdmin(jwtDecode(data.access)['isSuperuser']);
            localStorage.setItem('authToken', JSON.stringify(data))
        } else {
            logoutUser();
        }
    }

    let contextData = {
        user:user,
        updateToken:updateToken,
        isAdmin:isAdmin,
        authToken:authToken,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}