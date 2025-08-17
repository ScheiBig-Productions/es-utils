#!/usr/bin/env node
import { writeFile, readFile } from "fs/promises"
import { execSync } from "child_process"

const [ , , versionArg, message ] = process.argv
if (versionArg === "push") {
	// [fixme]: need command that will try committing changelog
	console.log("Pushing release...")
	execSync("git push && git push --tags")
	const newVersion = JSON.parse(execSync("npm version --json").toString())["es-utils"]
	console.log(`✅ Released ${newVersion} successfully!`)
	process.exit(0)
}
if (!versionArg || !message) {
	console.error("Usage: node release.mjs <major/minor/patch/version> '<message>'")
	console.error("Usage: node release.mjs push")
	process.exit(1)
}

let newVersion = execSync(`npm version ${versionArg} --no-git-tag-version`).toString().trim()

const changelogPath = "CHANGELOG.md"
const changelogEntry = `
### [${new Date().toISOString().split("T")[ 0 ]}] - \`${newVersion.replace(/v/, "")}\`

${message}`

let changelogContent = `
# Changelog
#### es-utils

Simple journal of changes made to package

---`.trimStart()

try {
	changelogContent = await readFile(changelogPath, "utf-8")
} catch (error) {
	console.warn("⚠️ No existing CHANGELOG.md found, creating a new one.")
}

const changelog = (() => {
	let [ start, end ] = changelogContent.split("---", 2)
	start += "---\n"
	return { start, end }
})()

await writeFile(changelogPath, changelog.start + changelogEntry + changelog.end)

execSync(`git commit -am "release ${newVersion}: ${message}"`)
execSync(`git tag ${newVersion} -m "${message}"`)

console.log(`✅ Prepared release ${newVersion} successfully!`)
console.log(`Place changes into ${changelogPath} and re-run with "push" to send changes.`)
