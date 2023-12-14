import { Alert } from "react-native";
import { currentToken } from "./auth/spotifyAuth";

const apiBaseUrl = "https://api.spotify.com/v1";

export interface UserInfo {
	display_name: string;
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string | null;
		total: number;
	};
	href: string;
	id: string;
	images: UserImage[];
	type: string;
	uri: string;
}

interface UserImage {
	height: number;
	url: string;
	width: number;
}

/**
 * Retrieves user data from the server.
 *
 * @returns {Promise<UserInfo>} The user data.
 */
export async function getUserData(): Promise<UserInfo> {
	const token = await currentToken.access_token;

	const response = await fetch(`${apiBaseUrl}/me`, {
		method: "GET",
		headers: { Authorization: "Bearer " + token },
	});

	return await response.json();
}

/**
 * Generates a top 25 playlist for a given user.
 *
 * @param {string | undefined} userId - The ID of the user for whom the playlist is generated.
 * @return {Promise<void>} - A Promise that resolves when the playlist is successfully generated.
 */
export async function generateTop25Playlist(userId: string | undefined): Promise<void> {
	const topTrackURIs = await getTopTracks();
	await createPlaylistAndFill(topTrackURIs, userId);
}

/* ------------------------------------------------
 *      Non-exports
 */

/**
 * Retrieves the top tracks for the authenticated user.
 *
 * @return {Promise<string[]>} An array of track URIs representing the top tracks.
 */
async function getTopTracks(): Promise<string[]> {
	const topTracksUrl = `${apiBaseUrl}/me/top/tracks?time_range=short_term&limit=25&offset=0`;
	const accessToken = await currentToken.access_token;
	const topTracksHeaders = {
		Authorization: `Bearer ${accessToken}`,
	};

	const response = await fetch(topTracksUrl, {
		headers: topTracksHeaders,
	});
	const responseJSON = await response.json();
	const trackURIs = responseJSON.items.map((track: any) => track.uri);

	return trackURIs;
}

/**
 * Creates a playlist and adds the specified track URIs to it. The playlist is created for the specified user ID.
 *
 * @param {any[]} trackURIs - An array of track URIs to add to the playlist.
 * @param {string | undefined} userId - The user ID for whom the playlist is created.
 * @return {Promise<void>} - A Promise that resolves once the playlist is created and the tracks are added.
 */
async function createPlaylistAndFill(trackURIs: any, userId: string | undefined): Promise<void> {
	const accessToken = await currentToken.access_token;
	const authHeaders = {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	};

	// Create the playlist
	const createPlaylistUrl = `${apiBaseUrl}/users/${userId}/playlists`;
	const createPlaylistRequestBody = {
		name: "Best of Past 4 Weeks",
		description: "Your top songs from the past 4 weeks, generated automatically by code.",
		public: false,
	};

	let playlistID = "";
	await fetch(createPlaylistUrl, {
		method: "POST",
		headers: authHeaders,
		body: JSON.stringify(createPlaylistRequestBody),
	})
		.then((response) => response.json())
		.then((responseJSON) => {
			playlistID = responseJSON["id"];
		});

	// Add top songs to the playlist
	const uriString = trackURIs.join("%2c").replace(/:/g, "%3a");
	const addTracksUrl = `${apiBaseUrl}/playlists/${playlistID}/tracks?uris=${uriString}`;
	const addTracksRequestBody = {
		uris: ["string"],
		positon: 0,
	};

	await fetch(addTracksUrl, {
		method: "POST",
		headers: authHeaders,
		body: JSON.stringify(addTracksRequestBody),
	}).then(() => {
		Alert.alert("Top 25 Playlist Created!", "Now head over to your Spotify app to check it out!");
	});
}
