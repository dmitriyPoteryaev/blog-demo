import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Blog from "modules/Blog";
import Auth from "modules/Auth";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Страница авторизации */}
        <Route path="/auth" element={<Auth />} />

        {/* Страница блога */}
        <Route path="/blog" element={<Blog />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
