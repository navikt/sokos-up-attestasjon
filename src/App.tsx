import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.module.css";
import NotFound from "./components/NotFound";
import DetaljerPage from "./pages/detaljer/DetaljerPage";
import SokPage from "./pages/sok/SokPage";
import TrefflistePage from "./pages/treffliste/TrefflistePage";
import { initGrafanaFaro } from "./util/grafanaFaro";
import { BASENAME, DETALJER, ROOT, TREFFLISTE } from "./util/routenames";

const App = () => {
  useEffect(() => {
    if (
      import.meta.env.MODE !== "mock" &&
      import.meta.env.MODE !== "backend" &&
      import.meta.env.MODE !== "backend-q1"
    )
      initGrafanaFaro();
  }, []);

  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route path={ROOT} element={<SokPage />} />
        <Route path={TREFFLISTE} element={<TrefflistePage />} />,
        <Route path={DETALJER} element={<DetaljerPage />} />,
        <Route path={"*"} element={<NotFound />} />,
      </Routes>
    </BrowserRouter>
  );
};

export default App;
