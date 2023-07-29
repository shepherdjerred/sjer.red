import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import BlogList from "./pages/BlogList";
import Home from "./pages/Home";
import { PostRouter } from "./posts/posts";
import GlobalStyles from "./styles/GlobalStyles";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/*" element={<PostRouter />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
