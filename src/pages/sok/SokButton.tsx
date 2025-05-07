import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";

export default function SokButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button
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
