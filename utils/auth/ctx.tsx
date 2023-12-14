import React from "react";
import { useAuthRequest } from "expo-auth-session";
import { useStorageState } from "../useStorageState";
import { spotifyAuthData, currentToken, spotifyGetAuthToken } from "./spotifyAuth";
import { router } from "expo-router";

const AuthContext = React.createContext<{
	signIn: () => void;
	signOut: () => void;
	session?: string | null;
	isLoading: boolean;
} | null>(null);

// This hook can be used to access the user info.
export function useSession(): any {
	const value = React.useContext(AuthContext);
	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error("useSession must be wrapped in a <SessionProvider />");
		}
	}

	return value;
}

/**
 * Initializes and provides the session context for the application.
 *
 * @param {React.PropsWithChildren} props - The props for the SessionProvider component.
 * @return {React.ReactNode} The children components wrapped in the SessionProvider context.
 */
export function SessionProvider(props: React.PropsWithChildren): React.ReactNode {
	const [[isLoading, session], setSession] = useStorageState("session");

	const [accessCodeRequest, accessCodeResponse, promptAsyncSignIn] = useAuthRequest(
		{
			clientId: spotifyAuthData.clientId,
			scopes: spotifyAuthData.scopes,
			usePKCE: false,
			redirectUri: spotifyAuthData.redirectUri,
			extraParams: { show_dialog: "true" },
		},
		spotifyAuthData.endpoints
	);

	React.useEffect(() => {
		if (accessCodeResponse?.type === "success") {
			const { code } = accessCodeResponse.params;
			spotifyGetAuthToken(code)
				.then((tokenResponse) => {
					currentToken.save(tokenResponse);
					setSession("xxx");
					router.replace("/");
				})
				.catch((error) => console.log("Error during token retrieval:", error));
		}
	}, [accessCodeResponse]);

	return (
		<AuthContext.Provider
			value={{
				signIn: async () => {
					await promptAsyncSignIn();
				},
				signOut: () => {
					currentToken.clear();
					setSession(null);
				},
				session,
				isLoading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
