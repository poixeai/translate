import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout/AppLayout";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";
import { PublicOnly, RequireAuth } from "@/routes/guards";

export const router = createBrowserRouter([
  {
    element: <PublicOnly />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
        ],
      },
    ],
  },
]);
