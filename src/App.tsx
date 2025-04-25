import { Suspense, useEffect } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
} from "react-router";
import "./App.module.css";
import ContentLoader from "./components/ContentLoader";
import NotFound from "./components/NotFound";
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
      <RouterProvider
        router={createBrowserRouter(
          createRoutesFromElements(
            <Route path={ROOT} ErrorBoundary={ErrorBoundary}>
              <Route path={ROOT} element={<SokPage />} />
              <Route path={"/treffliste"} element={<TrefflistePage />} />,
              <Route path={"/detaljer"} element={<DetaljerPage />} />,
              <Route path={"*"} element={<NotFound />} />,
            </Route>,
          ),
          { basename: BASENAME },
        )}
      />
    </Suspense>
  );
};

function ErrorBoundary(): JSX.Element {
  const error = useRouteError();
  throw error;
}

export default App;
