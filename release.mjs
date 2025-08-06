import { writeFile, readFile } from "fs/promises"
import { execSync } from "child_process"
import packageJson from "./package.json" with { type: "json" }

// --- Get CLI Arguments ---
const [ , , versionArg, message ] = process.argv
if (!versionArg || !message) {
	console.error("Usage: node release.mjs <major/minor/patch/version> '<message>'")
	process.exit(1)
}

// --- Determine New Version ---
let newVersion = execSync(`npm version ${versionArg} --no-git-tag-version`).toString().trim()

// --- Update `CHANGELOG.md` ---
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

// --- Create Git Tag ---
execSync(`git commit -am "release ${newVersion}: ${message}"`)
execSync(`git tag ${newVersion} -m "${message}"`)

console.log(`✅ Released ${newVersion} successfully!`)
