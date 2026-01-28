---
description: Create a production release (Version Bump, Tag, Changelog, GitHub Release).
allowed-tools: Bash, GitHub CLI
---

# Release Workflow (Production Cut)

1. **Pre-Release Verification**
   - **Action**: Run `git checkout main && git pull origin main`.
   - **Check**: Ensure `git status` is clean.
   - **Tests**: Run `npm test` (or full CI check) to ensure `main` is stable.

2. **Version Bump (Semantic Versioning)**
   - **Analyze**: Check `git log` since last tag to determine impact:
     - **Major**: Breaking changes.
     - **Minor**: New features.
     - **Patch**: Bug fixes.
   - **Action**: Run `npm version [major|minor|patch] -m "chore(release): %s"`.
   - **Note**: This updates `package.json` and creates a git tag.

3. **Changelog Generation**
   - **Action**: Generate a changelog based on commits since the last tag.
   - **Draft**: Create a temporary file `CHANGELOG_DRAFT.md` with grouped changes (Features, Fixes, Chores).

4. **GitHub Release**
   - **Action**: Push the new version and tag: `git push && git push --tags`.
   - **Create Release**: 
     - Run `gh release create v[version] --title "v[version]" --notes-file CHANGELOG_DRAFT.md`.
     - Output: "🚀 Release v[version] published to GitHub."

5. **Post-Release (Optional)**
   - **Deployment**: If applicable, trigger deployment scripts (e.g., `eas build`).
