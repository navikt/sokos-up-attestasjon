import { BodyShort, Box, Button, Heading, List } from "@navikt/ds-react";
import { Link, useNavigate } from "react-router";
import styles from "./NotFound.module.css";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<Box paddingBlock="20 16" data-aksel-template="404-v2">
			<div className={styles["not-found"]}>
				<Heading level="1" size="large" spacing>
					Beklager, vi fant ikke siden
				</Heading>
				<BodyShort>
					Denne siden kan være slettet eller flyttet, eller det er en feil i
					lenken.
				</BodyShort>
				<List>
					<List.Item>Bruk gjerne menyen</List.Item>
					<List.Item>
						<Link
							to="#"
							onClick={(e) => {
								e.preventDefault();
								navigate(-1);
							}}
							aria-label="Gå tilbake til forrige side"
							title="Gå tilbake til forrige side"
						>
							Gå tilbake til forrige side
						</Link>
					</List.Item>
				</List>
				<Button as="a" href="/">
					Gå til hovedsiden
				</Button>
			</div>
		</Box>
	);
}
