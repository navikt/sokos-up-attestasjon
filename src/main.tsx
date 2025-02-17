import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";
import { BASENAME } from "./util/constants";

const startMsw = async () => {
  if (import.meta.env.MODE === "mock") {
    try {
      const { worker } = await import("../mock/browser");
      await worker.start({
        onUnhandledRequest: "bypass", // for assets o.l.
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to start MSW", error);
    }
  }
};

startMsw().then(() =>
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <div className="page-wrapper">
        <div className="page-layout">
          <main>
            <BrowserRouter basename={BASENAME}>
              <App />
            </BrowserRouter>
          </main>
        </div>
      </div>
    </React.StrictMode>,
  ),
);
