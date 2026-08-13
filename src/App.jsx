import { Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Assicurazioni from "./pages/Assicurazioni";
import StudioLegale from "./pages/StudioLegale";
import Personale from "./pages/Personale";
import Mail from "./pages/Mail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="assicurazioni" element={<Assicurazioni />} />
        <Route path="studio-legale" element={<StudioLegale />} />
        <Route path="personale" element={<Personale />} />
        <Route path="mail" element={<Mail />} />
      </Route>

      <Route path="*" element={<PaginaNonTrovata />} />
    </Routes>
  );
}

function PaginaNonTrovata() {
  return <h1 style={{ padding: "20px" }}>404 - Pagina non trovata</h1>;
}