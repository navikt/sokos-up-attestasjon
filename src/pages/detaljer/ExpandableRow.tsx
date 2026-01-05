import LabelText from "../../components/LabelText";
import type { Attestasjonlinje } from "../../types/Attestasjonlinje";
import styles from "./ExpandableRow.module.css";

export default function ExpandableRow({ data }: { data: Attestasjonlinje }) {
	return (
		<div className={styles["expandable-row"]}>
			<LabelText label="Kid" text={data.kid} />
			<LabelText label="Skyldner" text={data.skyldner} />
			<LabelText label="Refusjons id" text={data.refusjonsid} />
			<LabelText label="Utbetales til" text={data.utbetalesTil} />
			<LabelText label="Grad" text={data.grad} />
		</div>
	);
}
