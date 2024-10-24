import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./design-system-override.css";
import "./index.css";

const startMsw = async () => {
  if (import.meta.env.MODE === "mock") {
    try {
      const { worker } = await import("../mock/browser");
      await worker.start();
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
            <App />
          </main>
        </div>
      </div>
    </React.StrictMode>,
  ),
);
