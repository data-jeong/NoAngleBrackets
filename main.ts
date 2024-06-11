import {
	App,
	Editor,
	MarkdownView,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

export default class MyPlugin extends Plugin {
	async onload() {
		// 리본 아이콘 추가
		this.addRibbonIcon(
			"wrench",
			"Toggle Angle Brackets",
			(evt: MouseEvent) => {
				// 버튼 클릭 시 실행되는 코드
				this.toggleAngleBrackets();
			}
		);

		// 세팅 탭 추가
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	toggleAngleBrackets() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const editor = activeView.editor;
			const selection = editor.getSelection();
			const lines = selection.split("\n");
			let insideCodeBlock = false;
			const processedLines = lines.map((line) => {
				if (line.startsWith("```")) {
					// 코드 블록 시작 또는 끝
					insideCodeBlock = !insideCodeBlock;
					return line;
				} else if (insideCodeBlock) {
					// 코드 블록 내부이면 변경하지 않음
					return line;
				} else {
					// 코드 블록 외부이면 '<'와 '>'를 백틱으로 감싸거나 백틱을 제거함
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

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
					this.plugin.toggleAngleBrackets();
				});
			});
	}
}
