import { Store } from "@sapphire/framework";
import type { ApplicationWebhook } from "../../webhooks/ApplicationWebhook";
import { WebhookManager } from "../pieces/WebhookManager";

export class WebhookManagerStore extends Store<WebhookManager> {
	public constructor() {
		super(WebhookManager, { name: "webhooks" });
	}

	public override get<K extends keyof WebhookManagerStoreEntries>(key: K): WebhookManagerStoreEntries[K];
	public override get(key: string) {
		return super.get(key);
	}
}

export interface WebhookManagerStoreEntries {
	applications: ApplicationWebhook;
}
