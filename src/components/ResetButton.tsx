import { FormEvent } from "react";
import { EraserIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useStore } from "../store/AppState";
import { BASENAME } from "../util/constants";

const ResetButton = () => {
  const { resetState } = useStore();

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
    resetState();
    window.location.replace(BASENAME);
  };

  return (
    <Button
      size="small"
      variant="tertiary"
      iconPosition="right"
      icon={<EraserIcon title="reset søk" fontSize="1.5rem" />}
      onClick={handleReset}
    >
      Nullstill søk
    </Button>
  );
};
export default ResetButton;
