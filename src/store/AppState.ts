import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Oppdrag, OppdragList } from "../types/Oppdrag";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { SokeData } from "../types/SokeData";

type AppState = {
  gjelderNavn: string;
  storedOppdragList?: OppdragList;
  oppdragsDetaljer?: OppdragsDetaljer;
  storedSokeData?: SokeData;
  oppdrag?: Oppdrag;
};

type AppStateActions = {
  resetState: () => void;
  setGjelderNavn: (gjelderNavn: string) => void;
  setStoredOppdrag: (oppdrag: OppdragList) => void;
  setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) => void;
  setStoredSokeData: (sokeData: SokeData) => void;
  setOppdrag: (oppdrag: Oppdrag | undefined) => void;
};

const initAppState = {
  gjelderNavn: "",
  storedOppdrag: undefined,
  oppdragsDetaljer: undefined,
  storedSokeData: undefined,
  oppdrag: undefined,
};

export const useStore = create<AppState & AppStateActions>()(
  devtools(
    persist(
      (set) => ({
        ...initAppState,
        resetState: () => set({ ...initAppState }),
        setGjelderNavn: (gjelderNavn: string) => set({ gjelderNavn }),
        setStoredOppdrag: (storedOppdragList: OppdragList) =>
          set({ storedOppdragList }),
        setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) =>
          set({ oppdragsDetaljer }),
        setStoredSokeData: (storedSokeData: SokeData) =>
          set({ storedSokeData }),
        setOppdrag: (oppdrag: Oppdrag | undefined) => set({ oppdrag }),
      }),
      {
        name: "app-state",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
