import { ApplyOptions } from "@sapphire/decorators";
import { Time } from "@sapphire/time-utilities";
import { MessageActionRow, MessageEmbed, Modal, TextInputComponent, TextInputStyleResolvable } from "discord.js";
import { Command } from "../lib/Command";

@ApplyOptions<Command.Options>({
	name: "apply",
	description: "Apply for Pixel Pizza"
	// TODO add precondition to check if application exists and is open
})
export class ApplyCommand extends Command {
	// Temporary property
	private readonly applications: {
		id: string;
		title: string;
		questions: {
			id: string;
			question: string;
			placeholder: string;
			style: TextInputStyleResolvable;
			required?: boolean;
			minlength?: number;
			maxlength?: number;
		}[];
	}[] = [
		{
			id: "worker",
			title: "Worker Application",
			questions: [
				{
					id: "rules",
					question: "Do you know the rules?",
					placeholder: "yes/no",
					style: "SHORT"
				},
				{
					id: "was_worker",
					question: "Have you been a worker before (if so when)?",
					placeholder: "yes/no, when were you a worker?",
					style: "SHORT"
				},
				{
					id: "why",
					question: "Why do you want to become a worker?",
					placeholder: "Please enter why you want to become a worker",
					style: "PARAGRAPH",
					minlength: 20
				},
				{
					id: "photo_editor",
					question: "Do you have a photo-edit program?",
					placeholder: "yes/no",
					style: "SHORT"
				},
				{
					id: "additional",
					question: "Is there anything else you wish to add?",
					placeholder: "If you are a previous worker and are interested in a rehire, state it here.",
					required: false,
					style: "PARAGRAPH"
				}
			]
		},
		{
			id: "teacher",
			title: "Teacher Application",
			questions: [
				{
					id: "online",
					question: "Are you online a lot?",
					placeholder: "yes/no",
					style: "SHORT"
				},
				{
					id: "good_teacher",
					question: "What makes you a good teacher?",
					placeholder: "Please enter why you want to become a teacher",
					style: "PARAGRAPH",
					minlength: 20
				},
				{
					id: "willing",
					question: "Do you want to teach others?",
					placeholder: "yes/no",
					style: "SHORT"
				},
				{
					id: "why_better",
					question: "why should we choose you?",
					placeholder: "Please enter why you should be chosen over other applicants",
					style: "PARAGRAPH",
					minlength: 20
				}
			]
		},
		{
			id: "developer",
			title: "Developer Application",
			questions: [
				{
					id: "languages",
					question: "What programming languages do you use?",
					placeholder: "Please enter programming languages you use",
					style: "PARAGRAPH"
				},
				{
					id: "experience",
					question: "How much experience do you have?",
					placeholder: "Please enter how much experience you have with programming",
					style: "PARAGRAPH"
				},
				{
					id: "why",
					question: "why do you want to become a developer?",
					placeholder: "Please enter why you want to become a Pixel Pizza developer",
					style: "PARAGRAPH",
					minlength: 20
				},
				{
					id: "github",
					question: "What is your github username?",
					placeholder: "Please enter your github username if you have one",
					required: false,
					style: "SHORT"
				}
			]
		},
		{
			id: "staff",
			title: "Staff Application",
			questions: [
				{
					id: "online",
					question: "Are you online much?",
					placeholder: "yes/no",
					style: "SHORT"
				},
				{
					id: "already_staff",
					question: "Are you staff in another server?",
					placeholder: "yes/no",
					style: "SHORT"
				},
				{
					id: "hours",
					question: "How many hours can you be online?",
					placeholder: "Please enter how many hours you can be online",
					style: "SHORT"
				},
				{
					id: "why",
					question: "Why should we hire you and not someone else?",
					placeholder: "Please enter why you should be hired over other applicants",
					style: "PARAGRAPH",
					minlength: 20
				},
				{
					id: "experience",
					question: "Do you have experience?",
					placeholder: "yes/no",
					style: "SHORT"
				}
			]
		}
	];

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("type").setDescription("The type of application").setRequired(true).setAutocomplete(true)
			),
			{ idHints: ["972087578432000030"] }
		);
	}

	public override autocompleteRun(interaction: Command.AutocompleteInteraction) {
		const focused = interaction.options.getFocused().toString().toLowerCase();
		return interaction.respond(
			this.applications
				.filter(
					(application) =>
						application.id.includes(focused) || application.title.toLowerCase().includes(focused)
				)
				.map((type) => ({
					name: type.title,
					value: type.id
				}))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction): Promise<any> {
		// TODO get application from database
		const application = this.applications.find(
			(application) => application.id === interaction.options.getString("type")
		)!;

		await interaction.showModal(
			new Modal()
				.setTitle(application.title)
				.setCustomId(application.id)
				.setComponents(
					...application.questions.map((question) => {
						const input = new TextInputComponent()
							.setLabel(question.question)
							.setCustomId(question.id)
							.setPlaceholder(question.placeholder)
							.setRequired(question.required)
							.setStyle(question.style);

						if (question.minlength) input.setMinLength(question.minlength);
						if (question.maxlength) input.setMaxLength(question.maxlength);

						return new MessageActionRow<TextInputComponent>().setComponents(input);
					})
				)
		);

		const modelInteraction = await interaction.awaitModalSubmit({ time: Time.Minute * 10 });

		await modelInteraction.deferReply({ ephemeral: true });

		await this.container.stores
			.get("webhooks")
			.get("applications")
			.send({
				embeds: [
					new MessageEmbed()
						.setColor("BLUE")
						.setTitle(application.title)
						.setDescription(`Application by ${modelInteraction.user}`)
						.setFields(
							application.questions.map((question) => ({
								name: question.question,
								value: modelInteraction.fields.getTextInputValue(question.id) || "N/A"
							}))
						)
				]
			});

		return modelInteraction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("Application Submitted")
					.setDescription("Your application has been submitted")
			]
		});
	}
}
