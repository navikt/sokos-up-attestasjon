import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { PaginatedOppdragList } from "../api/models/PaginatedDTO";
import { Oppdrag } from "../types/Oppdrag";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { SokeData } from "../types/SokeData";

export type AppState = {
  gjelderNavn: string;
  storedPaginatedOppdragList?: PaginatedOppdragList;
  oppdragsDetaljer?: OppdragsDetaljer;
  storedSokeData?: SokeData;
  oppdrag?: Oppdrag;
};

type AppStateActions = {
  resetState: () => void;
  setGjelderNavn: (gjelderNavn: string) => void;
  setStoredPaginatedOppdragList: (
    paginatedOppdragList: PaginatedOppdragList,
  ) => void;
  setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) => void;
  setStoredSokeData: (sokeData: SokeData) => void;
  setOppdrag: (oppdrag: Oppdrag | undefined) => void;
};

const initAppState = {
  gjelderNavn: "",
  storedPaginatedOppdragList: undefined,
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
        setStoredPaginatedOppdragList: (
          storedPaginatedOppdragList: PaginatedOppdragList,
        ) => set({ storedPaginatedOppdragList }),
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
