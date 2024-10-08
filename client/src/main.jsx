import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./features/store.jsx";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
