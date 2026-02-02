import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Blog from "modules/Blog";
import Auth from "modules/Auth";
import Article from "modules/Article";
import CreateArticle from "modules/CreateArticle"; 

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route path="/blog" element={<Blog />} />

        <Route path="/article/:id" element={<Article />} />
        <Route path="/article/new" element={<CreateArticle />} />

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
