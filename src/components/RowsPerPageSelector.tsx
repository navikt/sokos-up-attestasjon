import { ChevronDownIcon } from "@navikt/aksel-icons";
import { Button, Dropdown } from "@navikt/ds-react";
import commonstyles from "../styles/common-styles.module.css";
import styles from "./RowsPerPageSelector.module.css";

interface RowsPerPageSelectorProps {
  rowsPerPage: number;
  updateRowsPerPage: (rows: number) => void;
}

export default function RowsPerPageSelector(props: RowsPerPageSelectorProps) {
  return (
    <>
      <div className={styles.rowsperpageselector}>
        <Dropdown>
          <Button
            size={"xsmall"}
            variant={"tertiary-neutral"}
            as={Dropdown.Toggle}
          >
            <ChevronDownIcon title="a11y-title" fontSize="1.5rem" />
          </Button>
          <Dropdown.Menu>
            <Dropdown.Menu.GroupedList>
              <Dropdown.Menu.GroupedList.Heading>
                Hvor mange rader ønsker du å vise per side?
              </Dropdown.Menu.GroupedList.Heading>
              <Dropdown.Menu.Divider />
              {[5, 10, 25, 50].map((rows) => (
                <Dropdown.Menu.GroupedList.Item
                  key={rows}
                  onClick={() => props.updateRowsPerPage(rows)}
                >
                  {rows}
                </Dropdown.Menu.GroupedList.Item>
              ))}
            </Dropdown.Menu.GroupedList>
          </Dropdown.Menu>
        </Dropdown>
        <div className={commonstyles.nowrap}>
          <p>Vis {props.rowsPerPage} per side</p>
        </div>
      </div>
    </>
  );
}
