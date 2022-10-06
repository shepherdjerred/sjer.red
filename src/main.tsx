import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import BlogList from "./components/BlogList";
import { PostRouter } from "./posts/posts";
import GlobalStyles from "./styles/GlobalStyles";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/*" element={<PostRouter />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
