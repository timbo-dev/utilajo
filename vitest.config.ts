/// <reference types="vitest" />

import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsConfigPaths({
        projects: [
            'packages/interkapto'
        ]
    })],
    test: {
        globals: true,
        include: [
            '**/*.spec.ts',
            '**/*.test.ts'
        ]
    }
});
