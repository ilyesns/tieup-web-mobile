import "./App.css";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/auth_context";
import {
  RouterProvider,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";
import { router } from "./router/routes";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <ScrollToTop />
        </RouterProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
