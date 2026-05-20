import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import TopBar from "./components/TopBar";
import HomePage from "./pages/HomePage";
import BlogListPage from "./pages/BlogListPage";
import BlogPage from "./pages/BlogPage";
import CreationMainPage from "./pages/CreationMainPage";
import CreationTool from "./pages/CreationTool";
import SearchPage from "./pages/SearchPage";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TopBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/list/:type" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/create" element={<CreationMainPage />} />
          <Route path="/edit/:id" element={<CreationTool />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
