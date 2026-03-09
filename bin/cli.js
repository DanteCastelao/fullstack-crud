#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

// ─── Banner ────────────────────────────────────────────────────────────────────
const VERSION = '1.0.0';

// Handle --help and --version flags
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  Usage: fullstack-crud [options]

  Scaffold a production-ready full-stack CRUD application.

  Options:
    -h, --help      Show this help message
    -v, --version   Show version number
  `);
  process.exit(0);
}
if (args.includes('--version') || args.includes('-v')) {
  console.log(VERSION);
  process.exit(0);
}

console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════╗
║            fullstack-crud  v${VERSION}                ║
║   Full-Stack CRUD App Generator                  ║
║   React · Express · MongoDB · PrimeReact         ║
╚══════════════════════════════════════════════════╝
`));

// ─── Prompts ───────────────────────────────────────────────────────────────────
async function main() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-crud-app',
      validate: (input) => /^[a-z0-9-_]+$/.test(input) || 'Use lowercase letters, numbers, hyphens, or underscores only.',
    },
    {
      type: 'input',
      name: 'appTitle',
      message: 'Application title (shown in sidebar & login):',
      default: 'My App',
    },
    {
      type: 'input',
      name: 'brandColor',
      message: 'Brand color (hex):',
      default: '#00ABE6',
      validate: (input) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Enter a valid hex color (e.g. #00ABE6).',
    },
    {
      type: 'input',
      name: 'brandColorDark',
      message: 'Brand color hover/dark variant (hex):',
      default: '#0095c8',
      validate: (input) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Enter a valid hex color.',
    },
    {
      type: 'input',
      name: 'brandColorLight',
      message: 'Brand color light/highlight variant (hex):',
      default: '#d4f1f9',
      validate: (input) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Enter a valid hex color.',
    },
    {
      type: 'input',
      name: 'bgColor',
      message: 'Background color (hex):',
      default: '#EDF1EF',
      validate: (input) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Enter a valid hex color.',
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features to include:',
      choices: [
        { name: 'Email notifications (nodemailer)', value: 'email', checked: true },
        { name: 'PDF upload & processing', value: 'pdf', checked: true },
        { name: 'Excel export (xlsx)', value: 'excel', checked: true },
      ],
    },
    {
      type: 'input',
      name: 'adminEmail',
      message: 'Admin notification email (for email feature):',
      default: 'admin@example.com',
      when: (answers) => answers.features.includes('email'),
    },
  ]);

  const dest = path.resolve(process.cwd(), answers.projectName);

  if (fs.existsSync(dest)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory "${answers.projectName}" already exists. Overwrite?`,
        default: false,
      },
    ]);
    if (!overwrite) {
      console.log(chalk.yellow('Aborted.'));
      process.exit(0);
    }
    fs.removeSync(dest);
  }

  // ─── Copy Templates ─────────────────────────────────────────────────────────
  const spinner = ora('Scaffolding project...').start();

  try {
    // Copy backend template
    fs.copySync(path.join(TEMPLATES_DIR, 'backend'), path.join(dest, 'backend'));

    // Copy frontend template
    fs.copySync(path.join(TEMPLATES_DIR, 'frontend'), path.join(dest, 'frontend'));

    // Copy docker-compose.yml to project root
    const dockerComposeSrc = path.join(TEMPLATES_DIR, 'docker-compose.yml');
    if (fs.existsSync(dockerComposeSrc)) {
      fs.copySync(dockerComposeSrc, path.join(dest, 'docker-compose.yml'));
    }

    // ─── Replace Placeholders ────────────────────────────────────────────────
    const replacements = {
      '{{APP_TITLE}}': answers.appTitle,
      '{{BRAND_COLOR}}': answers.brandColor,
      '{{BRAND_COLOR_DARK}}': answers.brandColorDark,
      '{{BRAND_COLOR_LIGHT}}': answers.brandColorLight,
      '{{BG_COLOR}}': answers.bgColor,
      '{{ADMIN_EMAIL}}': answers.adminEmail || 'admin@example.com',
      '{{PROJECT_NAME}}': answers.projectName,
    };

    const filesToProcess = getAllFiles(dest).filter((f) =>
      /\.(js|jsx|ts|tsx|css|html|json|md|yml|yaml|env\.example)$/.test(f)
    );

    for (const file of filesToProcess) {
      let content = fs.readFileSync(file, 'utf-8');
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replaceAll(placeholder, value);
      }
      fs.writeFileSync(file, content, 'utf-8');
    }

    // Remove optional feature files if not selected
    if (!answers.features.includes('pdf')) {
      fs.removeSync(path.join(dest, 'backend', 'parsePDF.js'));
    }

    // Create root README
    const rootReadme = `# ${answers.appTitle}

Full-stack CRUD application built with React + Express + MongoDB.

Scaffolded with [fullstack-crud](https://github.com/DanteCastelao/fullstack-crud).

## Quick Start

\`\`\`bash
# Backend
cd backend
cp .env.example .env   # Edit with your values
npm install
npm start

# Frontend (new terminal)
cd frontend
cp .env.example .env   # Edit with your values
npm install
npm run dev
\`\`\`

## Tech Stack

- **Frontend:** React, Vite, PrimeReact, TailwindCSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT with role-based access control
`;

    fs.writeFileSync(path.join(dest, 'README.md'), rootReadme, 'utf-8');

    spinner.succeed(chalk.green('Project scaffolded successfully!'));

    // ─── Next Steps ──────────────────────────────────────────────────────────
    console.log();
    console.log(chalk.cyan.bold('  Next steps:'));
    console.log();
    console.log(`    ${chalk.white('cd')} ${chalk.yellow(answers.projectName)}`);
    console.log();
    console.log(chalk.dim('  Backend:'));
    console.log(`    ${chalk.white('cd backend')}`);
    console.log(`    ${chalk.white('cp .env.example .env')}  ${chalk.dim('# fill in your values')}`);
    console.log(`    ${chalk.white('npm install')}`);
    console.log(`    ${chalk.white('npm start')}`);
    console.log();
    console.log(chalk.dim('  Frontend:'));
    console.log(`    ${chalk.white('cd frontend')}`);
    console.log(`    ${chalk.white('cp .env.example .env')}  ${chalk.dim('# fill in your values')}`);
    console.log(`    ${chalk.white('npm install')}`);
    console.log(`    ${chalk.white('npm run dev')}`);
    console.log();
    console.log(chalk.green.bold('  Happy coding! 🚀'));
    console.log();
  } catch (error) {
    spinner.fail(chalk.red('Failed to scaffold project.'));
    console.error(error);
    process.exit(1);
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getAllFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      results.push(...getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

main().catch((err) => {
  console.error(chalk.red('Error:'), err);
  process.exit(1);
});
