import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

describe('Template Structure', () => {
    describe('Backend', () => {
        const backendDir = path.join(TEMPLATES_DIR, 'backend');

        it('has a tsconfig.json', () => {
            assert.ok(fs.existsSync(path.join(backendDir, 'tsconfig.json')));
        });

        it('has a package.json with TypeScript scripts', () => {
            const pkg = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf-8'));
            assert.ok(pkg.scripts.dev, 'should have dev script');
            assert.ok(pkg.scripts.build, 'should have build script');
            assert.ok(pkg.scripts.start, 'should have start script');
            assert.ok(pkg.devDependencies.typescript, 'should have typescript dependency');
        });

        it('has all required source files', () => {
            const requiredFiles = [
                'src/server.ts',
                'src/seed.ts',
                'src/types/index.ts',
                'src/utils/env.ts',
                'src/models/User.ts',
                'src/middleware/auth.ts',
                'src/middleware/admin.ts',
                'src/middleware/role.ts',
                'src/middleware/errorHandler.ts',
                'src/middleware/validate.ts',
                'src/routes/auth.ts',
                'src/routes/users.ts',
            ];

            for (const file of requiredFiles) {
                assert.ok(
                    fs.existsSync(path.join(backendDir, file)),
                    `Missing: ${file}`
                );
            }
        });

        it('has Dockerfile', () => {
            assert.ok(fs.existsSync(path.join(backendDir, 'Dockerfile')));
        });

        it('has .env.example', () => {
            assert.ok(fs.existsSync(path.join(backendDir, '.env.example')));
        });

        it('uses helmet and express-rate-limit', () => {
            const pkg = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf-8'));
            assert.ok(pkg.dependencies.helmet, 'should have helmet');
            assert.ok(pkg.dependencies['express-rate-limit'], 'should have express-rate-limit');
        });

        it('uses zod for validation', () => {
            const pkg = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf-8'));
            assert.ok(pkg.dependencies.zod, 'should have zod');
        });
    });

    describe('Frontend', () => {
        const frontendDir = path.join(TEMPLATES_DIR, 'frontend');

        it('has tsconfig.json', () => {
            assert.ok(fs.existsSync(path.join(frontendDir, 'tsconfig.json')));
        });

        it('has a package.json with TypeScript scripts', () => {
            const pkg = JSON.parse(fs.readFileSync(path.join(frontendDir, 'package.json'), 'utf-8'));
            assert.ok(pkg.scripts.build.includes('tsc'), 'build should include tsc');
            assert.ok(pkg.devDependencies.typescript, 'should have typescript');
        });

        it('index.html points to main.tsx', () => {
            const html = fs.readFileSync(path.join(frontendDir, 'index.html'), 'utf-8');
            assert.ok(html.includes('main.tsx'), 'should reference main.tsx');
        });

        it('has all required source files', () => {
            const requiredFiles = [
                'src/main.tsx',
                'src/App.tsx',
                'src/axios.ts',
                'src/context/AuthContext.tsx',
                'src/routes/AppRouter.tsx',
                'src/components/Login/Login.tsx',
                'src/components/Sidebar/Sidebar.tsx',
                'src/components/ErrorBoundary/ErrorBoundary.tsx',
                'src/pages/Dashboard/Dashboard.tsx',
                'src/pages/NotFound/NotFound.tsx',
            ];

            for (const file of requiredFiles) {
                assert.ok(
                    fs.existsSync(path.join(frontendDir, file)),
                    `Missing: ${file}`
                );
            }
        });

        it('has postcss.config.js for Tailwind', () => {
            assert.ok(fs.existsSync(path.join(frontendDir, 'postcss.config.js')));
        });

        it('has vite.config.ts (TypeScript)', () => {
            assert.ok(fs.existsSync(path.join(frontendDir, 'vite.config.ts')));
        });
    });

    describe('Docker', () => {
        it('has docker-compose.yml', () => {
            assert.ok(fs.existsSync(path.join(TEMPLATES_DIR, 'docker-compose.yml')));
        });
    });
});

describe('Placeholder Consistency', () => {
    it('all placeholders in templates are documented in CLI', () => {
        const cliContent = fs.readFileSync(path.join(__dirname, '..', 'bin', 'cli.js'), 'utf-8');

        function findPlaceholders(dir) {
            const results = new Set();
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    if (entry.name === 'node_modules') continue;
                    for (const ph of findPlaceholders(fullPath)) {
                        results.add(ph);
                    }
                } else if (/\.(ts|tsx|js|jsx|css|html|json|yml|yaml)$/.test(entry.name)) {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const matches = content.match(/\{\{[A-Z_]+\}\}/g);
                    if (matches) {
                        for (const m of matches) results.add(m);
                    }
                }
            }
            return results;
        }

        const placeholders = findPlaceholders(TEMPLATES_DIR);

        for (const ph of placeholders) {
            assert.ok(
                cliContent.includes(ph),
                `Placeholder ${ph} found in templates but not handled in CLI`
            );
        }
    });
});
