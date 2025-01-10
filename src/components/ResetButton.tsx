import { FormEvent } from "react";
import { useNavigate } from "react-router";
import { EraserIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useStore } from "../store/AppState";
import { EVENT_NAME } from "../umami/umami";
import { ROOT } from "../util/constants";

export default function ResetButton() {
  const { resetState } = useStore();
  const navigate = useNavigate();

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
    resetState();
    navigate(ROOT);
  };

  return (
    <Button
      data-umami-event={EVENT_NAME.RESET}
      size="small"
      variant="tertiary"
      iconPosition="right"
      icon={<EraserIcon title="reset søk" fontSize="1.5rem" />}
      onClick={handleReset}
    >
      Nytt søk
    </Button>
  );
}
