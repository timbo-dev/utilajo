import cp, { spawnSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';

type SpawnOut = cp.SpawnSyncReturns<Buffer>
type SpawnOptions = cp.SpawnSyncOptionsWithBufferEncoding

const packageName = 'either';
const sutJsFileName = 'index.js';
const indexJsFilePath = join(process.cwd(), 'e2e', packageName, sutJsFileName);

let bun: (...args: string[]) => SpawnOut;
let commandEither: (command: string, ...args: string[]) => SpawnOut;

const createCommand = (options: SpawnOptions = { stdio: 'ignore' }) =>
    (command: string, ...args: string[]): SpawnOut => {
        console.log(`\x1b[33m${command} ${args.join(' ')}`);
        return spawnSync(command, args, options);
    };
const command = createCommand();

const createSut = (sutFunc: TemplateStringsArray) => {
    fs.writeFileSync(indexJsFilePath, sutFunc[0], 'utf-8');

    return () => {
        const response = commandEither('node', sutJsFileName);

        return response.status;
    };
};


beforeAll(() => {
    command('mkdir', '-p', `e2e/${packageName}`);
    command('bun', 'run', 'build', `${packageName}`);

    commandEither = createCommand({
        stdio: 'inherit',
        cwd: join('e2e', packageName)
    });

    bun = (...args: string[]) => commandEither('bun', ...args);

    commandEither('npm', 'init', '-y');
    bun('add', '../../packages/either');
});

beforeEach(() => {
    commandEither('rm', 'index.js');
});

it('should create an EitherOk instance', () => {
    commandEither('npm', 'pkg', 'set', 'type=module');

    const execModuleSut = createSut`
        import { ok, EitherOk } from '@utilajo/either';

        function sut() {
            const sut = ok('ok message');

            if (!(sut instanceof EitherOk)) process.exit(1);
            if (sut.isErr()) process.exit(1);

            if (!sut.isOk()) process.exit(1);
            if (sut.getValue() !== 'ok message') process.exit(1);

            process.exit(0);
        };

        sut();
    `;

    expect(execModuleSut()).toBe(0);
});
