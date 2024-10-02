import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { SokeData } from "../components/form/SokeSchema";
import { Oppdrag } from "../types/Oppdrag";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";

type AppState = {
  gjelderNavn: string;
  storedOppdrag?: Oppdrag[];
  oppdragsDetaljer?: OppdragsDetaljer;
  storedSokeData?: SokeData;
};

type AppStateActions = {
  resetState: () => void;
  setGjelderNavn: (gjelderNavn: string) => void;
  setStoredOppdrag: (oppdrag: Oppdrag[]) => void;
  setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) => void;
  setStoredSokeData: (sokeData: SokeData) => void;
};

const initAppState = {
  gjelderNavn: "",
  storedOppdrag: undefined,
  oppdragsDetaljer: undefined,
  storedSokeData: undefined,
};

export const useAppState = create<AppState & AppStateActions>()(
  devtools(
    persist(
      (set) => ({
        ...initAppState,
        resetState: () => set({ ...initAppState }),
        setGjelderNavn: (gjelderNavn: string) => set({ gjelderNavn }),
        setStoredOppdrag: (storedOppdrag: Oppdrag[]) => set({ storedOppdrag }),
        setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) =>
          set({ oppdragsDetaljer }),
        setStoredSokeData: (storedSokeData: SokeData) =>
          set({ storedSokeData }),
      }),
      {
        name: "app-state",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
