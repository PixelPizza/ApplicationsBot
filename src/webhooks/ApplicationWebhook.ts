import { ApplyOptions } from "@sapphire/decorators";
import { WebhookManager } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManager.Options>(({ container }) => ({
	name: "applications",
	webhookName: "Pixel Pizza Applications",
	channelId: container.env.string("APPLICATION_CHANNEL_ID")
}))
export class ApplicationWebhook extends WebhookManager {}
