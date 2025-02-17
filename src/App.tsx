import { Suspense, useEffect } from "react";
import { Route, Routes, useRouteError } from "react-router";
import "./App.module.css";
import ContentLoader from "./components/ContentLoader";
import DetaljerPage from "./pages/detaljer/DetaljerPage";
import SokPage from "./pages/sok/SokPage";
import TrefflistePage from "./pages/treffliste/TrefflistePage";
import { BASENAME, ROOT } from "./util/constants";
import { initGrafanaFaro } from "./util/grafanaFaro";

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
    <Suspense fallback={<ContentLoader />}>
      <Routes>
        <Route path={BASENAME + ROOT} ErrorBoundary={ErrorBoundary}>
          <Route path={BASENAME + ROOT} element={<SokPage />} />
          <Route path={BASENAME + "/treffliste"} element={<TrefflistePage />} />
          ,
          <Route path={BASENAME + "/detaljer"} element={<DetaljerPage />} />,
        </Route>
      </Routes>
    </Suspense>
  );
};

function ErrorBoundary(): JSX.Element {
  const error = useRouteError();
  throw error;
}

export default App;
