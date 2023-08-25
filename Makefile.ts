import swc from '@swc/core';
import fs, { mkdirSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { dirname } from 'path';
import { exit } from 'process';

const PACKAGES_DIR = 'packages';
const SRC_DIR = 'src';
const LIB_DIR = 'lib';

const args = process.argv.splice(2);

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const ENDCOLOR = '\x1b[0m';

void async function() {
    const commands: {
        [key: string]: () => void
    } = {
        async build() {
            const tsFiles = await glob(`${PACKAGES_DIR}/**/*.ts`);

            build(tsFiles);
            exit(0);
        }
    };

    const run = commands[args[0]];
    if (run) run();
    else {
        console.error(`${RED}command '${args[0] ?? usage()}' not found${ENDCOLOR}`);
        usage();
        exit(127);
    }
}();

function usage() {
    console.log('make');
    exit(1);
}

async function build(tsFiles: string[]) {
    const startTaskTime = performance.now();

    function parseToJs(filePath: string) {
        return filePath
            .replace(`/${SRC_DIR}/`, `/${LIB_DIR}/`)
            .replace('.ts', '.js');
    }

    function transpileTsFile(filePath: string): swc.Output {
        const config = loadSwcConfig('./.swcrc');
        const fileContent = fs.readFileSync(filePath, 'utf8');

        return swc.transformSync(fileContent, {
            ...config
        });
    }

    function loadSwcConfig(filePath: string): swc.Options {
        const fileContent = fs.readFileSync(filePath, {
            encoding: 'utf-8'
        });

        type SwcOptionsWithSchema = {
            '$schema': string
        } & swc.Options

        const configObject = JSON.parse(fileContent) as SwcOptionsWithSchema;
        delete configObject['$schema'];

        return configObject;
    }

    const jsFiles = tsFiles.map(parseToJs);

    tsFiles.forEach((tsFile, index) => {
        mkdirSync(dirname(jsFiles[index]), {
            recursive: true
        });

        console.log(`${GREEN}Transpile${ENDCOLOR}\t => ${YELLOW}${tsFile}${ENDCOLOR}`);
        const output = transpileTsFile(tsFile);

        writeFileSync(jsFiles[index], output.code, {
            encoding: 'utf-8'
        });
    });

    const endTaskTime = performance.now();
    console.log(`${GREEN}Transpile finished: ${YELLOW}${calcTaskTimeResult(startTaskTime, endTaskTime)}ms${ENDCOLOR}`);
}

function calcTaskTimeResult(startTaskTime: number, endTaskTime: number): string {
    return (endTaskTime - startTaskTime).toFixed(2);
}
