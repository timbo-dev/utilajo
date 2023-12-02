/// <reference types="vitest" />

import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsConfigPaths({
        projects: [
            'packages/either'
        ]
    })],
    test: {
        typecheck: {
            include: [
                '**/*.e2e.ts'
            ]
        },
        watchExclude: ['e2e'],
        globals: true,
        include: [
            '**/*.e2e.ts'
        ]
    }
});
