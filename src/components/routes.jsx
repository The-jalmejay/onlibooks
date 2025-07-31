import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoute.js";
import MainComponent from "./mainComponents";
import React from "react";
import Home from "./home";
import Books from "./books";
import Login from "./login";
import Logout from "./logout";
import Setting from "./Setting";
import MyBookds from "./myBooks";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainComponent />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/My Books",

        element: (
          <ProtectedRoute>
            <MyBookds />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Login",
        element: <Login />,
      },

      {
        path: "/Logout",
        element: <Logout />,
      },
      {
        path: "/Settings",
        element: (
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
