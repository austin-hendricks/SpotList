import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

/**
 * Generates a custom React hook that provides an async state.
 *
 * @param {Array<boolean, T | null>} [initialValue=[true, null]] - The initial state value of the async state.
 * @returns {UseStateHook<T>} The custom React hook that provides the async state.
 */
function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
	return React.useReducer(
		(state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
		initialValue
	) as UseStateHook<T>;
}

/**
 * Sets a value in the storage asynchronously.
 *
 * @param {string} key - The key to set in the storage.
 * @param {string | null} value - The value to set. Use null to remove the key.
 * @return {Promise<void>} - A promise that resolves when the value is set in the storage.
 */
export async function setStorageItemAsync(key: string, value: string | null): Promise<void> {
	if (Platform.OS === "web") {
		try {
			if (value === null) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, value);
			}
		} catch (e) {
			console.error("Local storage is unavailable:", e);
		}
	} else {
		if (value == null) {
			await SecureStore.deleteItemAsync(key);
		} else {
			await SecureStore.setItemAsync(key, value);
		}
	}
}

/**
 * Generates a hook that provides a state value and a setter function to manage the state value in local storage or secure store.
 *
 * @param {string} key - The key to use for storing the state value.
 * @return {UseStateHook<string>} A tuple containing the state value and the setter function.
 */
export function useStorageState(key: string): UseStateHook<string> {
	// Public
	const [state, setState] = useAsyncState<string>();

	// Get
	React.useEffect(() => {
		if (Platform.OS === "web") {
			try {
				if (typeof localStorage !== "undefined") {
					setState(localStorage.getItem(key));
				}
			} catch (e) {
				console.error("Local storage is unavailable:", e);
			}
		} else {
			SecureStore.getItemAsync(key).then((value) => {
				setState(value);
			});
		}
	}, [key]);

	// Set
	const setValue = React.useCallback(
		(value: string | null) => {
			setState(value);
			setStorageItemAsync(key, value);
		},
		[key]
	);

	return [state, setValue];
}
