import type { WebhookManagerStore } from "./lib/stores/WebhookManagerStore";

export declare module "@kaname-png/plugin-env" {
	export interface EnvKeys {
		// Add env variables here
		TOKEN: never;
		APPLICATION_CHANNEL_ID: never;
	}
}

export declare module "@sapphire/pieces" {
	export interface StoreRegistryEntries {
		// Add stores here
		webhooks: WebhookManagerStore;
	}

	export interface Container {}
}
