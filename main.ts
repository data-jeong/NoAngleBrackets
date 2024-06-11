import {
	App,
	Editor,
	MarkdownView,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

export default class NoAngleBracketsPlugin extends Plugin {
	async onload() {
		this.addRibbonIcon(
			"wrench",
			"Toggle Angle Brackets",
			this.toggleAngleBrackets.bind(this)
		);

		this.addSettingTab(new NoAngleBracketsSettingTab(this.app, this));
	}

	async toggleAngleBrackets() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const editor = activeView.editor;
			const selection = editor.getSelection();
			const lines = selection.split("\n");
			let insideCodeBlock = false;
			const processedLines = lines.map((line) => {
				if (line.startsWith("```")) {
					insideCodeBlock = !insideCodeBlock;
					return line;
				} else if (insideCodeBlock) {
					return line;
				} else {
					if (line.includes("`<") || line.includes(">`")) {
						return line.replace(/`</g, "<").replace(/>`/g, ">");
					} else {
						return line.replace(/</g, "`<").replace(/>/g, ">`");
					}
				}
			});
			const processedText = processedLines.join("\n");
			editor.replaceSelection(processedText);
		}
	}
}

class NoAngleBracketsSettingTab extends PluginSettingTab {
	plugin: NoAngleBracketsPlugin;

	constructor(app: App, plugin: NoAngleBracketsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Toggle angle brackets")
			.setDesc(
				"Click the button to toggle backticks around angle brackets in the selected text (outside code blocks)."
			)
			.addButton((button) => {
				button.setButtonText("Toggle").onClick(async () => {
					await this.plugin.toggleAngleBrackets();
				});
			});
	}
}
