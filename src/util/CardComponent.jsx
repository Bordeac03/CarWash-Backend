import React from 'react';

const CardComponent = ({order, finishOrder}) => {
    const parseTimeStamp = (ts) => {
        const date = new Date(ts * 1000);
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const formattedDate = date.toLocaleDateString('de-DE', dateOptions);
        const formattedTime = date.toLocaleTimeString('de-DE', timeOptions);
        return `${formattedDate} ${formattedTime}`;
    }

  return (
    <div className='card-content-wrapper'>
        <div className='card-header-div'>
            <h1>{order.service.name}</h1>
            <h1 style={{wordSpacing: '2rem'}}>{parseTimeStamp(order.ts)}</h1>
        </div>
        <div className='card-content-div'>
            <div className='user-data'>
                <h2>User: {order.user.fullName}</h2>
                <h2>Email: {order.user.email}</h2>
            </div>
            <div className='service-data'>
                <h2>Price: {order.service.price} RON</h2>
                <h2>Proximity: {order.closeBy ? 'Close by' : 'Not close by'}</h2>
            </div>
        </div>
        <div className='card-footer-div'>
            <h1>Status: {order.active ? "Active" : "Finished"}</h1>
            <button onClick={() => finishOrder(order.ID)}>Finish Order</button>
        </div>
    </div>
  )
}

export default CardComponent