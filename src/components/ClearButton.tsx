import { Button } from "@navikt/ds-react";
import type React from "react";

interface ClearButtonProps {
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ClearButton(props: ClearButtonProps) {
	return (
		<Button variant="secondary-neutral" size="small" onClick={props.onClick}>
			Tøm
		</Button>
	);
}
