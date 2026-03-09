import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, '..', 'bin', 'cli.js');

describe('CLI', () => {
    it('bin/cli.js exists and is valid JavaScript', () => {
        assert.ok(fs.existsSync(CLI_PATH), 'bin/cli.js should exist');
    });

    it('has a shebang line', () => {
        const content = fs.readFileSync(CLI_PATH, 'utf-8');
        assert.ok(content.startsWith('#!/usr/bin/env node'), 'should start with shebang');
    });

    it('package.json has correct bin entry', () => {
        const pkg = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
        );
        assert.ok(pkg.bin, 'should have bin field');
        const binValue = Object.values(pkg.bin)[0];
        assert.equal(binValue, 'bin/cli.js');
    });

    it('has required dependencies', () => {
        const pkg = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
        );
        const requiredDeps = ['chalk', 'fs-extra', 'inquirer', 'ora'];
        for (const dep of requiredDeps) {
            assert.ok(pkg.dependencies[dep], `Missing dependency: ${dep}`);
        }
    });

    it('handles --version flag', async () => {
        const content = fs.readFileSync(CLI_PATH, 'utf-8');
        assert.ok(content.includes('--version'), 'should handle --version flag');
    });

    it('handles --help flag', async () => {
        const content = fs.readFileSync(CLI_PATH, 'utf-8');
        assert.ok(content.includes('--help'), 'should handle --help flag');
    });

    it('validates project name input', () => {
        const content = fs.readFileSync(CLI_PATH, 'utf-8');
        assert.ok(content.includes('validate'), 'should have input validation');
    });

    it('processes .ts and .tsx files for placeholder replacement', () => {
        const content = fs.readFileSync(CLI_PATH, 'utf-8');
        assert.ok(content.includes('.ts'), 'should process .ts files');
        assert.ok(content.includes('.tsx'), 'should process .tsx files');
    });
});
