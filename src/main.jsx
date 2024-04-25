import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import { Home } from './routes/Home.jsx';
import Order from './routes/Order.jsx';
import 'leaflet/dist/leaflet.css';
import { UserProvider } from './util/UserContext.jsx';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/order",
		element: <Order />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<UserProvider>
	    <RouterProvider router={router} />
	</UserProvider>,
)
