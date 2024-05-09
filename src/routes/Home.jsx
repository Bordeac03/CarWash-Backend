import React, { useEffect, useState } from 'react';
import CardComponent from '../util/CardComponent';
import { carwashInstance } from '../util/instances';

const Home = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const getOrders = () => {
        carwashInstance().get('/order')
        .then((res) => {
            if (!res.data.orders) {
                return;
            }
            setOrders(res.data.orders);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const finishOrder = (orderID) => {
        setLoading(true);
        carwashInstance().patch("/order", {
            orderID: orderID
        })
        .then((res) => {
            if (res.status !== 200) {
                return;
            }
            getOrders();
        })
        .catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        getOrders();
    }, []);

  return (
    <div className='main'>
        {loading && <span className='loader'></span>}
        {!loading && <>
            <div className='home-div'>
                {orders.map((order, index) => {
                    return <div key={index} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '80vw', margin: '2rem 0'}}>
                            <CardComponent order={order} finishOrder={finishOrder} />
                        </div>
                })}
            </div>
        </>}
    </div>
  )
}

export default Home