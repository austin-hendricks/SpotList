import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useSession } from "../../utils/auth/ctx";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../components/ui/Button";
import { UserInfo, generateTop25Playlist, getUserData } from "../../utils/spotifyAPI";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Index() {
	const navigation = useNavigation();
	const { signOut } = useSession();
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	useEffect(() => {
		navigation.setOptions({ headerShown: false });
		getUserData().then((result: UserInfo) => {
			setUserInfo(result);
		});
	}, [navigation]);

	const handleGeneratePlaylist = async () => {
		await generateTop25Playlist(userInfo?.id);
		console.log("Success!");
	};

	const handleLogout = () => {
		signOut();
	};

	return (
		<LinearGradient colors={["#040306", "#131624"]} style={styles.gradientContainer}>
			<SafeAreaView>
				<View style={styles.spacer} />
				<Text style={styles.textMain}>Logged in as {userInfo?.display_name}</Text>
				<View style={styles.imageContainer}>
					<Image
						style={{ width: userInfo?.images[0]?.width, height: userInfo?.images[0]?.height }}
						source={userInfo?.images[0]?.url}
						placeholder={blurhash}
						contentFit="cover"
						transition={1000}
					/>
				</View>
				<Text style={styles.textParagraph}>{userInfo?.id}</Text>
				<View style={styles.spacer} />
				<Button theme="primary" label="Generate Top 25 Playlist" onPress={handleGeneratePlaylist} />
				<Button label="Log Out" onPress={handleLogout} />
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
		marginHorizontal: 20,
	},
	textParagraph: {
		color: "#fff",
		fontSize: 20,
		textAlign: "center",
	},
	spacer: {
		height: 80,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 20,
	},
});
