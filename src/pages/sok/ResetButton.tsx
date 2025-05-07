import { FormEvent } from "react";
import { useFormContext } from "react-hook-form";
import { EraserIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useStore } from "../../store/AppState";
import { SOK } from "../../umami/umami";

export default function ResetButton({
  clearError,
}: {
  clearError: () => void;
}) {
  const { resetState } = useStore();
  const { reset } = useFormContext();

  function handleReset(e: FormEvent) {
    e.preventDefault();
    clearError();
    resetState();
    reset();
  }
  return (
    <Button
      data-umami-event={SOK.RESET}
      id={"nullstill"}
      variant="secondary"
      size={"small"}
      iconPosition="right"
      icon={<EraserIcon aria-hidden />}
      onClick={handleReset}
    >
      Nullstill søk
    </Button>
  );
}
