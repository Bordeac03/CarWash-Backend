import React from "react";
import { UserContext } from "../util/UserContext";
import { useContext } from "react";
import { RiCarWashingFill } from "react-icons/ri";
import { useState } from "react";
import { ToggleSlider }  from "react-toggle-slider";

const AdminDashboard = () => {
    const [status, setStatus] = useState('Active');

    const handleStatusChange = (newStatus) => {
        console.log(newStatus); // Log the new status
        setStatus(newStatus);
    };

    const ToggleSliderWithStatus = () => {
        const handleChange = (event) => {
            const newStatus = event.target.checked ? 'Active' : 'Inactive';
            handleStatusChange(newStatus);
        };

        return <ToggleSlider onChange={handleChange} />;
    };

    return (
        <div className="dashboard-admin">
            <h1>Admin Dashboard</h1>
            <table className="carwash-list">
                <tr>
                    <td></td>
                    <td>Name</td>
                    <td>Address</td>
                    <td>Status</td>
                </tr>
                <tr>
                    <td><button style={{fontSize:'3rem'}}><RiCarWashingFill /></button></td>
                    <td>Car Wash 1</td>
                    <td>1234 Main St</td>
                    <td><div style={{marginLeft:'39%'}}><ToggleSliderWithStatus/></div></td>
                </tr>
            </table>
        </div>
    );
}

export default AdminDashboard;