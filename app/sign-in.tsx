import { useSession } from "../utils/auth/ctx";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Entypo } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import { StatusBar } from "expo-status-bar";

export default function SignIn() {
	const { signIn, isLoading } = useSession();

	return (
		<LinearGradient colors={["#040306", "#131624"]} style={styles.gradientContainer}>
			<SafeAreaView>
				<View style={styles.spacer} />
				<Entypo name="spotify" size={80} color="white" style={{ textAlign: "center" }} />
				<Text style={styles.textMain}>Millions of Songs Free on Spotify!</Text>
				<View style={styles.spacer} />
				<Button theme="primary" label="Sign In with Spotify" disabled={isLoading} onPress={signIn} />
			</SafeAreaView>
			<StatusBar style="light" />
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	gradientContainer: {
		flex: 1,
	},
	textMain: {
		color: "#fff",
		fontSize: 40,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 40,
	},
	spacer: {
		height: 80,
	},
});
