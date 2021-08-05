import * as vscode from 'vscode';
import { Article, Settings, StatusListener } from './commands';
import { Folders } from './commands/Folders';
import { Project } from './commands/Project';
import { Template } from './commands/Template';
import { COMMAND_NAME } from './constants/Extension';
import { TaxonomyType } from './models';
import { TagType } from './viewpanel/TagType';
import { ExplorerView } from './webview/ExplorerView';

let frontMatterStatusBar: vscode.StatusBarItem;
let debouncer: { (fnc: any, time: number): void; };
let collection: vscode.DiagnosticCollection;

export async function activate({ subscriptions, extensionUri }: vscode.ExtensionContext) {
	collection = vscode.languages.createDiagnosticCollection('frontMatter');

	const explorerSidebar = ExplorerView.getInstance(extensionUri);
	let explorerView = vscode.window.registerWebviewViewProvider(ExplorerView.viewType, explorerSidebar, {
		webviewOptions: {
			retainContextWhenHidden: true
		}
	});

	let insertTags = vscode.commands.registerCommand(COMMAND_NAME.insertTags, async () => {
		await vscode.commands.executeCommand('workbench.view.extension.frontmatter-explorer');
		await vscode.commands.executeCommand('workbench.action.focusSideBar');
		explorerSidebar.triggerInputFocus(TagType.tags);
	});

	let insertCategories = vscode.commands.registerCommand(COMMAND_NAME.insertCategories, async () => {
		await vscode.commands.executeCommand('workbench.view.extension.frontmatter-explorer');
		await vscode.commands.executeCommand('workbench.action.focusSideBar');
		explorerSidebar.triggerInputFocus(TagType.categories);
	});

	let createTag = vscode.commands.registerCommand(COMMAND_NAME.createTag, () => {
		Settings.create(TaxonomyType.Tag);
	});

	let createCategory = vscode.commands.registerCommand(COMMAND_NAME.createCategory, () => {
		Settings.create(TaxonomyType.Category);
	});

	let exportTaxonomy = vscode.commands.registerCommand(COMMAND_NAME.exportTaxonomy, () => {
		Settings.export();
	});

	let remap = vscode.commands.registerCommand(COMMAND_NAME.remap, () => {
		Settings.remap();
	});

	let setDate = vscode.commands.registerCommand(COMMAND_NAME.setDate, () => {
		Article.setDate();
	});

	let setLastModifiedDate = vscode.commands.registerCommand(COMMAND_NAME.setLastModifiedDate, () => {
		Article.setLastModifiedDate();
	});

	let generateSlug = vscode.commands.registerCommand(COMMAND_NAME.generateSlug, () => {
		Article.generateSlug();
	});

	let createFromTemplate = vscode.commands.registerCommand(COMMAND_NAME.createFromTemplate, (folder: vscode.Uri) => {
		const folderPath = Folders.getFolderPath(folder);
    if (folderPath) {
      Template.create(folderPath);
    }
	});

	const toggleDraftCommand = COMMAND_NAME.toggleDraft;
	const toggleDraft = vscode.commands.registerCommand(toggleDraftCommand, async () => {
		await Article.toggleDraft();
		triggerShowDraftStatus();
	});

	// Register project folders
	const registerFolder = vscode.commands.registerCommand(COMMAND_NAME.registerFolder, Folders.register);

	const unregisterFolder = vscode.commands.registerCommand(COMMAND_NAME.unregisterFolder, Folders.unregister);

	const createContent = vscode.commands.registerCommand(COMMAND_NAME.createContent, Folders.create);

	Folders.updateVsCodeCtx();

	// Initialize command
	Template.init();
	const projectInit = vscode.commands.registerCommand(COMMAND_NAME.init, Project.init);

	// Things to do when configuration changes
	vscode.workspace.onDidChangeConfiguration(() => {
		Template.init();
		Folders.updateVsCodeCtx();
	});

	// Create the status bar
 	frontMatterStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	frontMatterStatusBar.command = toggleDraftCommand;
	subscriptions.push(frontMatterStatusBar);
	debouncer = debounceShowDraftTrigger();
	// Register listeners that make sure the status bar updates
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(triggerShowDraftStatus));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(triggerShowDraftStatus));
	// Automatically run the command
	triggerShowDraftStatus();

	// Subscribe all commands
	subscriptions.push(
		insertTags,
		explorerView,
		insertCategories,
		createTag,
		createCategory,
		exportTaxonomy,
		remap,
		setDate,
		setLastModifiedDate,
		generateSlug,
		createFromTemplate,
		toggleDraft,
		registerFolder,
		unregisterFolder,
		createContent,
		projectInit
	);
}

export function deactivate() {}

const triggerShowDraftStatus = () => {
	debouncer(() => { StatusListener.verify(frontMatterStatusBar, collection); }, 1000);
};

const debounceShowDraftTrigger = () => {
  let timeout: NodeJS.Timeout;

  return (fnc: any, time: number) => {
    const functionCall = (...args: any[]) => fnc.apply(args);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time) as any;
  };
};