import { Suspense, useEffect } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.module.css";
import ContentLoader from "./components/common/ContentLoader";
import DetaljerPage from "./pages/DetaljerPage";
import SokPage from "./pages/SokPage";
import TrefflistePage from "./pages/TrefflistePage";
import { BASENAME } from "./util/constants";
import { initGrafanaFaro } from "./util/grafanaFaro";

const App = () => {
  useEffect(() => {
    initGrafanaFaro();
  }, []);

  return (
    <Suspense fallback={<ContentLoader />}>
      <RouterProvider
        router={createBrowserRouter(
          createRoutesFromElements(
            <>
              <Route path="/" element={<SokPage />} />
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
