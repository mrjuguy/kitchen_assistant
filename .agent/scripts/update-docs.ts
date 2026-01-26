import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables (useful for local testing)
dotenv.config();

// Initialize Anthropic Client
// Ensure ANTHROPIC_API_KEY is set in your Repo Secrets
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Configuration: List of files The Scribe should maintain
const DOCS_TO_UPDATE = [
    'README.md',
    'specs/tech-stack.md'
];

/**
 * Retrieves the context of the last commit to understand what changed.
 */
async function getGitContext() {
    try {
        // Get commit message and file stats
        const commitInfo = execSync('git log -1 --stat', { encoding: 'utf-8' });

        // Get the actual code diff (truncated to prevent token limits)
        const diff = execSync('git show HEAD --pretty=""', { encoding: 'utf-8' }).slice(0, 4000);

        return `COMMIT INFO:\n${commitInfo}\n\nCODE CHANGES (Truncated):\n${diff}`;
    } catch (error) {
        console.error('Failed to get git context:', error);
        process.exit(1);
    }
}

/**
 * Sends the document and code context to Claude to generate an updated version.
 */
async function updateDocument(filePath: string, gitContext: string) {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ File not found: ${filePath}, skipping.`);
        return;
    }

    const currentContent = fs.readFileSync(fullPath, 'utf-8');
    console.log(`✍️  Scribe is reviewing: ${filePath}...`);

    try {
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022", // Use a high-intelligence model for docs
            max_tokens: 4096,
            system: "You are 'The Scribe', a technical documentation bot. Your goal is to keep documentation 100% in sync with code. You will be given a file and a set of code changes. You must update the file to reflect the changes. Return ONLY the updated file content. Do not include markdown code fences (```) or conversational text.",
            messages: [
                {
                    role: "user",
                    content: `
            CURRENT FILE CONTENT (${filePath}):
            ${currentContent}

            RECENT CODE CHANGES:
            ${gitContext}

            INSTRUCTIONS:
            1. If the code changes introduce new features, add them to the relevant section.
            2. If dependencies changed, update installation instructions.
            3. If the changes are irrelevant to this document (e.g. simple typo fix), return the CURRENT FILE CONTENT exactly as is.
            4. Output ONLY the raw markdown of the new file.
          `
                }
            ]
        });

        const newContent = message.content[0].type === 'text' ? message.content[0].text : currentContent;

        // Sanity check: Don't overwrite if the LLM returned empty or error
        if (newContent.length > 50) {
            fs.writeFileSync(fullPath, newContent);
            console.log(`✅ Updated: ${filePath}`);
        } else {
            console.warn(`⚠️  Skipped ${filePath}: Response too short.`);
        }

    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error);
    }
}

/**
 * Main Execution Flow
 */
async function main() {
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error("❌ ANTHROPIC_API_KEY is missing. Set it in Repo Secrets.");
        process.exit(1);
    }

    console.log("📜 The Scribe has started...");
    const context = await getGitContext();

    for (const doc of DOCS_TO_UPDATE) {
        await updateDocument(doc, context);
    }
}

main();