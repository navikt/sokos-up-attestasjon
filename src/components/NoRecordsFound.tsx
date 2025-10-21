import { useNavigate } from "react-router";
import { Button, Heading } from "@navikt/ds-react";
import styles from "./EmptyList.module.css";

type NoRecordsFoundProps = {
  buttonText?: string;
  navigateTo?: string;
};

export default function NoRecordsFound({
  buttonText,
  navigateTo = "/",
}: NoRecordsFoundProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <div className={styles.container}>
      <Heading size="medium" spacing align="center">
        Listen er tom. Alle radene er behandlet.
      </Heading>
      <Button
        size="small"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        className={styles.button}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}
