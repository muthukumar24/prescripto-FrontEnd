import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    
    const currencySymbol = '₹';
    
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token'): '');
    const [userData, setUserData] = useState(false);
    const [loading, setLoading] = useState(false);

    // Getting Doctors Data
    const getDoctorsData = async() => {
        setLoading(true);
        try {
            const {data} = await axios.get('https://prescripto-backend-1af3.onrender.com/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
        finally{
            setLoading(false)
        }
    }

    // getting user profile
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get('https://prescripto-backend-1af3.onrender.com/api/user/get-profile', {headers: { token }});

            if(data.success){
                setUserData(data.userData);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if(token){
            loadUserProfileData();
        }
    }, [token])

    const value = {
        doctors, getDoctorsData,
        currencySymbol, token, setToken,
        userData, setUserData, loadUserProfileData, loading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}


export default AppContextProvider;