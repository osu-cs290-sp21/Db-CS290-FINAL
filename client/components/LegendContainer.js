// import styles from "../styles/LegendContainer.module.scss";
import styles from "../styles/LegendContainer.module.scss";
const LegendContainer = ({ name, color, children }) => {
	const { container, legend } = styles;
	return (
		<fieldset style={{ borderColor: color }} className={container}>
			<legend style={{ color }} className={legend}>
				{name}
			</legend>
			{children}
		</fieldset>
	);
};
export default LegendContainer;
