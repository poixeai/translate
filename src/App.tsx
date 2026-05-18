import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "@/routes";
import { useAuth } from "@/stores/auth.store";

function App() {
  const fetchCurrentUser = useAuth((state) => state.fetchCurrentUser);

  useEffect(() => {
    void fetchCurrentUser();
  }, [fetchCurrentUser]);

  return <RouterProvider router={router} />;
}

export default App
