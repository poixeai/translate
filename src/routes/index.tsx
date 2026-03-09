import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout/AppLayout";

import HomePage from "@/pages/home/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
]);
