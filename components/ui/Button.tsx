import { StyleSheet, Pressable, Text } from "react-native";

export default function Button(btn: { label: string; theme?: string; onPress?: any; icon?: any; disabled?: boolean }) {
	const buttonStyle = btn.theme === "primary" ? styles.primaryButton : styles.standardButton;
	const buttonLabelStyle = btn.theme === "primary" ? styles.primaryButtonLabel : styles.standardButtonLabel;

	return (
		<Pressable style={buttonStyle} onPress={btn.onPress} disabled={btn.disabled}>
			<Text style={buttonLabelStyle}>{btn.label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	primaryButton: {
		backgroundColor: "#1db954",
		padding: 10,
		marginLeft: "auto",
		marginRight: "auto",
		width: 300,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	primaryButtonLabel: {
		color: "#000",
	},
	standardButton: {
		backgroundColor: "#131624",
		padding: 10,
		marginLeft: "auto",
		marginRight: "auto",
		width: 300,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		marginVertical: 10,
		borderColor: "#c0c0c0",
		borderWidth: 0.8,
	},
	standardButtonLabel: {
		color: "#fff",
	},
});
