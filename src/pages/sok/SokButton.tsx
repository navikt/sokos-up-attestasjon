import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { SOK } from "../../umami/umami";

export default function SokButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button
      data-umami-event={SOK.VALIDATE}
      id={"search"}
      type="submit"
      size={"small"}
      loading={isLoading}
      icon={<MagnifyingGlassIcon aria-hidden />}
      iconPosition="right"
    >
      Søk
    </Button>
  );
}
