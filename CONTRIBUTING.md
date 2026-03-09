# Contributing to fullstack-crud

Thank you for considering contributing! Here's how you can help.

## 🐛 Bug Reports

1. Check if the issue already exists in [Issues](https://github.com/DanteCastelao/fullstack-crud/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Node.js and OS version

## ✨ Feature Requests

Open an issue with the `enhancement` label and describe:
- What you'd like to see
- Why it would be useful
- Any implementation ideas

## 🔧 Pull Requests

1. Fork the repo and create your branch from `main`
2. Install dependencies: `npm install`
3. Make your changes
4. Test the CLI by running: `node bin/cli.js`
5. Ensure the scaffolded project builds without errors
6. Submit your PR with a clear description

## 📝 Code Style

- Use ES Modules (`import/export`) in the CLI and frontend
- Use CommonJS (`require`) in the backend templates
- Follow the existing code patterns
- Add JSDoc comments for utility functions

## 📂 Project Structure

```
bin/cli.js         → CLI entry point (modify prompts or scaffold logic here)
templates/backend  → Express + MongoDB template files
templates/frontend → React + Vite template files
docs/              → Documentation
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
