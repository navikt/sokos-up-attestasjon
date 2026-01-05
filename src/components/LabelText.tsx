import styles from "./LabelText.module.css";

interface LabelTextProps {
	label: string;
	text: string | number | undefined;
	visible?: boolean;
}

export default function LabelText({
	label,
	text,
	visible = true,
}: LabelTextProps) {
	return (
		visible &&
		text && (
			<div className={styles.label}>
				<div className={styles.label__text}>{label}:</div>
				<div>{text}</div>
			</div>
		)
	);
}
