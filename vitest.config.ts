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
        typecheck: {
            include: [
                '**/*.spec.ts',
                '**/*.test.ts'
            ]
        },
        globals: true,
        include: [
            '**/*.spec.ts',
            '**/*.test.ts'
        ]
    }
});
