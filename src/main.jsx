import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './routes/Home.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from './util/UserContext.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>,
)
