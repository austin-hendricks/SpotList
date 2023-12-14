import { encode } from "base-64";
import * as SecureStore from "expo-secure-store";

export const spotifyAuthData = {
	endpoints: {
		authorizationEndpoint: "https://accounts.spotify.com/authorize",
		tokenEndpoint: "https://accounts.spotify.com/api/token",
	},
	clientId: "YOUR_CLIENT_ID",
	clientSecret: "YOUR_CLIENT_SECRET",
	redirectUri: "exp://localhost:19000/--/spotify-auth-callback",
	scopes: ["user-top-read", "playlist-modify-public", "playlist-modify-private"],
};

// Data structure that manages the current active token, caching it in AsyncStorage
export const currentToken = {
	get access_token() {
		return SecureStore.getItemAsync("access_token") || null;
	},
	get refresh_token() {
		return SecureStore.getItemAsync("refresh_token") || null;
	},
	get expires_in() {
		return SecureStore.getItemAsync("expires_in") || null;
	},
	get expires() {
		return SecureStore.getItemAsync("expires") || null;
	},

	save: function (response: { access_token: string; refresh_token: string; expires_in: number }) {
		const { access_token, refresh_token, expires_in } = response;
		SecureStore.setItemAsync("access_token", access_token);
		SecureStore.setItemAsync("refresh_token", refresh_token);
		SecureStore.setItemAsync("expires_in", expires_in.toString());

		const now = new Date();
		const expiry = new Date(now.getTime() + expires_in * 1000);
		SecureStore.setItemAsync("expires", expiry.toDateString());
	},

	clear: function () {
		SecureStore.deleteItemAsync("access_token");
		SecureStore.deleteItemAsync("refresh_token");
		SecureStore.deleteItemAsync("expires_in");
		SecureStore.deleteItemAsync("expires");
	},
};

/**
 * Retrieves an authorization token from Spotify using a authorization code.
 *
 * @param {string} code - The authorization code provided by Spotify.
 * @return {Promise<any>} - A promise that resolves to the JSON response from Spotify containing the authorization token.
 */
export async function spotifyGetAuthToken(code: string): Promise<any> {
	const credentials = "Basic " + encode(spotifyAuthData.clientId + ":" + spotifyAuthData.clientSecret);
	const formData = new URLSearchParams({
		code: code,
		redirect_uri: spotifyAuthData.redirectUri,
		grant_type: "authorization_code",
	});

	const response = await fetch(spotifyAuthData.endpoints.tokenEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: credentials,
		},
		body: formData.toString(),
	});

	return await response.json();
}
