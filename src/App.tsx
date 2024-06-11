import { useEffect } from "react";
import "./App.module.css";
import SokPage from "./pages/SokPage";
import { initGrafanaFaro } from "./util/grafanaFaro";

const App = () => {
  useEffect(() => {
    initGrafanaFaro();
  }, []);

  return <SokPage />;
};

export default App;
