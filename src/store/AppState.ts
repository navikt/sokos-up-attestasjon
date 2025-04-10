import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { OppdragDTO, OppdragDTOList } from "../types/Oppdrag";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { SokeData } from "../types/SokeData";

export type AppState = {
  gjelderNavn: string;
  oppdragDtoList?: OppdragDTOList;
  oppdragsDetaljer?: OppdragsDetaljer;
  sokeData?: SokeData;
  oppdragDto?: OppdragDTO;
};

type AppStateActions = {
  resetState: () => void;
  setGjelderNavn: (gjelderNavn: string) => void;
  setOppdragDtoList: (oppdragDtoList: OppdragDTOList) => void;
  setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) => void;
  setSokeData: (sokeData: SokeData) => void;
  setOppdragDto: (oppdragDto: OppdragDTO | undefined) => void;
};

const initAppState = {
  gjelderNavn: "",
  oppdragDtoList: undefined,
  oppdragsDetaljer: undefined,
  sokeData: undefined,
  oppdragDto: undefined,
};

export const useStore = create<AppState & AppStateActions>()(
  devtools(
    persist(
      (set) => ({
        ...initAppState,
        resetState: () => set({ ...initAppState }),
        setGjelderNavn: (gjelderNavn: string) => set({ gjelderNavn }),
        setOppdragDtoList: (oppdragDtoList: OppdragDTOList) =>
          set({ oppdragDtoList }),
        setOppdragsDetaljer: (oppdragsDetaljer: OppdragsDetaljer) =>
          set({ oppdragsDetaljer }),
        setSokeData: (sokeData: SokeData) => set({ sokeData }),
        setOppdragDto: (oppdragDto: OppdragDTO | undefined) =>
          set({ oppdragDto }),
      }),
      {
        name: "app-state",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
