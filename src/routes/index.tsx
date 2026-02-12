import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout/AppLayout";

import HomePage from "@/pages/home/HomePage";
import TranslatePage from "@/pages/translate/TranslatePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "translate", element: <TranslatePage /> },
    ],
  },
]);
