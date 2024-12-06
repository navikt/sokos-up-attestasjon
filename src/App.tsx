import { Suspense, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
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
    if (
      import.meta.env.MODE !== "mock" &&
      import.meta.env.MODE !== "backend" &&
      import.meta.env.MODE !== "backend-q1"
    )
      initGrafanaFaro();
  }, []);

  return (
    <Suspense fallback={<ContentLoader />}>
      <Helmet>
        <script
          defer
          src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
          data-host-url="https://umami.nav.no"
          data-website-id="e174f8d8-4082-4cb0-8280-b992d0a47901"
        ></script>
      </Helmet>
      <RouterProvider
        router={createBrowserRouter(
          createRoutesFromElements(
            <Route path={ROOT} ErrorBoundary={ErrorBoundary}>
              <Route path={ROOT} element={<SokPage />} />
              <Route path={"/treffliste"} element={<TrefflistePage />} />,
              <Route path={"/detaljer"} element={<DetaljerPage />} />,
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
