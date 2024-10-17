import { Suspense, useEffect } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.module.css";
import ContentLoader from "./components/ContentLoader";
import DetaljerPage from "./pages/detaljer/DetaljerPage";
import SokPage from "./pages/sok/SokPage";
import TrefflistePage from "./pages/treffliste/TrefflistePage";
import { BASENAME, ROOT } from "./util/constants";
import { initGrafanaFaro } from "./util/grafanaFaro";

const App = () => {
  useEffect(() => {
    if (window.location.hostname !== "localhost") initGrafanaFaro();
  }, []);

  return (
    <Suspense fallback={<ContentLoader />}>
      <RouterProvider
        router={createBrowserRouter(
          createRoutesFromElements(
            <>
              <Route path={ROOT} element={<SokPage />} />
              <Route path={"/treffliste"} element={<TrefflistePage />} />,
              <Route path={"/detaljer"} element={<DetaljerPage />} />,
            </>,
          ),
          { basename: BASENAME },
        )}
      />
    </Suspense>
  );
};

export default App;
