import "@sapphire/plugin-logger/register";
import "@kaname-png/plugin-env/register";
import { config } from "dotenv";
import { ApplicationCommandRegistries, container, RegisterBehavior } from "@sapphire/framework";
import { Client } from "./lib/Client";
import "./container";
import { WebhookManagerStore } from "./lib/stores/WebhookManagerStore";
import { join } from "node:path";
config();

async function main() {
	// Options can be configured in src/lib/Client.ts
	const client = new Client();

	ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

	client.stores.register(new WebhookManagerStore().registerPath(join(__dirname, "webhooks")));

	await client.login(container.env.string("TOKEN"));
}

void main();
