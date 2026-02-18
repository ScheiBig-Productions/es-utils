import { OptionDefaults } from "typedoc"

/** @type {Partial<import("typedoc").TypeDocOptions>} */
export const config = {
	$schema: "https://typedoc-plugin-markdown.org/schema.json",
	name: "es-utils - API docs",
	entryPoints: [
		"./src/*.ts"
	],
	out: "./wiki/",
	plugin: [
		"typedoc-plugin-markdown",
		"typedoc-github-wiki-theme"
	],
	exclude: [
		"./src/common",
	],
	readme: "none",
	enumMembersFormat: "table",
	parametersFormat: "table",
	propertiesFormat: "table",
	typeDeclarationFormat: "table",
	indexFormat: "table",
	gitRevision: "main",
	intentionallyNotExported: [
		"Symbol_enumValues"
	],
	blockTags: [
		...OptionDefaults.blockTags,
		"@important",
	]
}
export default config
