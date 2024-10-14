import commonstyles from "../styles/common-styles.module.css";

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
      <div className={commonstyles.row}>
        <div className={commonstyles.bold}>{label}:</div>
        <div>{text}</div>
      </div>
    )
  );
}
