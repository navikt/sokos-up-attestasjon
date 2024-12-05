import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Oppdrag, OppdragList } from "../types/Oppdrag";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { SokeData } from "../types/SokeData";

export type AppState = {
  gjelderNavn: string;
  oppdragList?: OppdragList;
  oppdragsDetaljer?: OppdragsDetaljer;
  sokeData?: SokeData;
  oppdrag?: Oppdrag;
};

type AppStateActions = {
  resetState: () => void;
  setGjelderNavn: (gjelderNavn: string) => void;
  setOppdragList: (oppdragList: OppdragList) => void;
  setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) => void;
  setSokeData: (sokeData: SokeData) => void;
  setOppdrag: (oppdrag: Oppdrag | undefined) => void;
};

const initAppState = {
  gjelderNavn: "",
  oppdragList: undefined,
  oppdragsDetaljer: undefined,
  sokeData: undefined,
  oppdrag: undefined,
};

export const useStore = create<AppState & AppStateActions>()(
  devtools(
    persist(
      (set) => ({
        ...initAppState,
        resetState: () => set({ ...initAppState }),
        setGjelderNavn: (gjelderNavn: string) => set({ gjelderNavn }),
        setOppdragList: (oppdragList: OppdragList) => set({ oppdragList }),
        setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) =>
          set({ oppdragsDetaljer }),
        setSokeData: (sokeData: SokeData) => set({ sokeData }),
        setOppdrag: (oppdrag: Oppdrag | undefined) => set({ oppdrag }),
      }),
      {
        name: "app-state",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
