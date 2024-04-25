import { React, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clientInstance } from '../util/instances';
import Cookies from 'js-cookie';


const Order = () => {
    const [displayError, setDisplayError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state;

    useEffect(() => {
        let objectToSend = {
            carWashID: order.carWashID,
        };

        let index = 1;
        order?.services?.map((service) => {
            for (let i = 1; i <= service.count; i++) {
                objectToSend = {
                    ...objectToSend,
                    [`service${index}`]: service.service.ID
                };
                index++;
            }
        });

        clientInstance().post("/order", objectToSend)
        .then((res) => {
            if (res.status === 200) {
                Cookies.set("order", "true");
                navigate("/");
            }
        })
        .catch((err) => {
            console.log(err);
            setDisplayError(true);
            Cookies.remove("order");
            setTimeout(() => {
                navigate("/");
            }, 5000);
        });
    }, [order]);

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
            {displayError && <p style={{color: "red", fontSize: "2rem"}}>An error occurred. Redirecting you back to the home page.</p>}
        </div>
    </div>
  )
}

export default Order