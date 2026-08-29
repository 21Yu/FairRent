import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainPage from "./pages/MainPage";
import DetailPage from "./pages/DetailPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/about" element={<AboutPage />}/>
        <Route path="/profile" element={<ProfilePage />}/>
        <Route path="/details/:id" element={<DetailPage />}/>
      </Routes>
    </BrowserRouter>
  );
}