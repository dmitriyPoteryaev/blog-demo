import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "modules/AuthForm";


const AppRouter = () => {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<AuthForm mode="signIn" />} />
        <Route path="/sign-up" element={<AuthForm mode="signUp" />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;

