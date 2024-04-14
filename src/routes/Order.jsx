import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/');
        }, 5000);
    }, []);

  return (
    <div className='main'>
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
        }}>
            <span className="loader"></span>
            <h1 style={{fontSize: "3rem"}}>Your order is being processed</h1>
        </div>
    </div>
  )
}

export default Order