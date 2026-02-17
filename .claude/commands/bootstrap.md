Bootstrap this boilerplate project
The user has just created this repository by using a Fullstack TypeScript Monorepo Boilerplate template repository.

This repository is now setup for building any type of Fullstack application.

## Step 1: Gather Information

Prompt the user about the following:
- Name (for package names and titles)
- Short description (one sentence)
- Use-Case of the project (what it does, who it's for)

## Step 2: Understand the Boilerplate

Read the README.md and CLAUDE.md to understand this template repository and how to use it. Any name and description placeholders like "Example application" should be replaced with actual values.

## Step 3: Update Package Metadata

Update the following files with the user's application name and description:

### Root package.json
- `name`: Change from "boilerplate" to kebab-case version of user's app name
- `description`: Add user's short description

### apps/server/package.json
- `name`: Change from "server" to "{app-name}-server"
- `description`: Add description like "{App Name} API server for {purpose}"

### apps/web/package.json
- `name`: Change from "web" to "{app-name}-web"
- `version`: Update to "1.0.0" (fresh start)

## Step 4: Update Web Application Metadata

### apps/web/index.html
- `<title>`: Change from "Application" to user's app name
- `<meta name="description">`: Change from "Example application" to user's short description

### apps/web/vite.config.ts
In the PWA manifest configuration:
- `manifest.name`: Change from "Application" to user's app name
- `manifest.short_name`: Change from "App" to shortened version (max 12 chars)
- `manifest.description`: Change from "Example application" to user's short description

## Step 5: Rewrite README.md

Create a new minimalistic README with the following structure:

1. **Hero Section**:
   - H1 with app name
   - 1-2 paragraph description of what it does and why it's useful

2. **Features Section**:
   - Bulleted list of key features based on the use case
   - Include relevant technical features (PWA, GraphQL, real-time updates, etc.)

3. **Getting Started**:
   - Prerequisites (Node.js version, pnpm)
   - Installation steps (clone, install, build)
   - Development steps (start backend, start frontend)
   - Include actual URLs and ports (http://localhost:8080, http://localhost:5173)
   - Mention GraphQL endpoint locations

4. **Production Build**:
   - Build commands
   - Docker build examples with correct app names

5. **Configuration**:
   - Backend environment variables (simplified list)
   - Frontend environment variables
   - PWA development mode

6. **Tech Stack**:
   - Brief overview of backend and frontend technologies
   - Mention key tools (Turborepo, pnpm, Biome, TypeScript)

7. **Available Scripts**:
   - Most common commands only (build, dev, test, check)

8. **Project Structure**:
   - Simple tree showing apps/ and libs/ directories

9. **License**: Keep as-is otherwise MIT. Update date in LICENSE file.

**Important**:
- Remove all boilerplate-specific documentation
- Remove detailed architecture explanations (that stays in CLAUDE.md)
- Remove step-by-step "Using This Template" sections
- Keep it concise and targeted to developers wanting to run/contribute to THIS app
- Preserve example API endpoints like health check as they're useful references

## Step 6: Update CLAUDE.md

Update the "Repository Overview" section only:
- Change the first paragraph to describe what THIS application does
- Keep the sentence about monorepo architecture
- Update Docker build examples with correct app names
- Leave all other sections intact (they're still relevant)

## Step 7: Do Not Remove

Keep these important elements:
- Example API requests and GraphQL modules (like server health)
- All development tooling and configuration
- Docker setup
- CI/CD workflows
- All technical infrastructure

## Summary

After completion, provide the user with:
1. List of all files changed
2. Brief description of what the app is now configured as
3. Next steps to start development (install, start backend, start frontend)
4. Note that example endpoints are still available as references