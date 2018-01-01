import * as assert from 'assert';
import * as path from 'path';
import * as TypeMoq from 'typemoq';
import { workspace, CancellationToken, CodeLens } from 'vscode';
import { CakeCodeLensProvider } from '../../src/codeLens/cakeCodeLensProvider';

export default function describeCodeLensTests() {
    const configsPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'test',
        'mocks',
        'files'
    );
    suite('CodeLens', () => {
        test('should get default codelens config from cake configuration', async () => {
            let config = workspace.getConfiguration('cake').inspect('codeLens');
            let defaultConfig: any =
                config == undefined
                    ? { defaultValue: {} }
                    : config.defaultValue;

            assert.equal(defaultConfig.showCodeLens, true);
            assert.equal(defaultConfig.scriptsIncludePattern, '**/*.cake');
            assert.equal(
                defaultConfig.taskRegularExpression,
                'Task\\s*?\\(\\s*?"(.*?)"\\s*?\\)'
            );
            assert.equal(defaultConfig.runTask.verbosity, 'normal');
            assert.equal(defaultConfig.debugTask.verbosity, 'normal');
            assert.equal(defaultConfig.debugTask.debugType, 'coreclr');
            assert.equal(defaultConfig.debugTask.request, 'launch');
            assert.equal(
                defaultConfig.debugTask.program,
                '${workspaceRoot}/tools/Cake.CoreCLR/Cake.dll'
            );
            assert.equal(defaultConfig.debugTask.cwd, '${workspaceRoot}');
            assert.equal(defaultConfig.debugTask.stopAtEntry, true);
            assert.equal(defaultConfig.debugTask.console, 'internalConsole');
            assert.equal(defaultConfig.debugTask.logging.exceptions, false);
            assert.equal(defaultConfig.debugTask.logging.moduleLoad, false);
            assert.equal(defaultConfig.debugTask.logging.programOutput, false);
            assert.equal(defaultConfig.debugTask.logging.engineLogging, false);
            assert.equal(defaultConfig.debugTask.logging.browserStdOut, false);
        });
        test('should provide empty tasks when codelens off', async () => {
            let taskRegularExpression = 'Task\\s*?\\(\\s*?"(.*?)"\\s*?\\)';
            let fileName = `${configsPath}/fakeBuild.cake`;
            let document = await workspace.openTextDocument(fileName);
            let provider = new CakeCodeLensProvider(taskRegularExpression);
            const cancellationTokenMock: TypeMoq.IMock<
                CancellationToken
            > = TypeMoq.Mock.ofType<CancellationToken>();
            cancellationTokenMock
                .setup(x => x.isCancellationRequested)
                .returns(() => false);

            provider.showCodeLens = false;
            const tasks = await provider.provideCodeLenses(
                document,
                cancellationTokenMock.object
            );

            assert.equal(tasks.length, 0);
        });
        test('should provide run and debug tasks when codelens on', async () => {
            let taskRegularExpression = 'Task\\s*?\\(\\s*?"(.*?)"\\s*?\\)';
            let fileName = `${configsPath}/fakeBuild.cake`;
            let document = await workspace.openTextDocument(fileName);
            let provider = new CakeCodeLensProvider(taskRegularExpression);
            const cancellationTokenMock: TypeMoq.IMock<
                CancellationToken
            > = TypeMoq.Mock.ofType<CancellationToken>();
            cancellationTokenMock
                .setup(x => x.isCancellationRequested)
                .returns(() => false);

            provider.showCodeLens = true;
            const tasks = await provider.provideCodeLenses(
                document,
                cancellationTokenMock.object
            );

            assert.equal(tasks.length, 4);
            assertTaskCommand(
                tasks[0],
                'run task',
                'cake.runTask',
                'Build',
                fileName
            );
            assertTaskCommand(
                tasks[1],
                'debug task',
                'cake.debugTask',
                'Build',
                fileName
            );
            assertTaskCommand(
                tasks[2],
                'run task',
                'cake.runTask',
                'Default',
                fileName
            );
            assertTaskCommand(
                tasks[3],
                'debug task',
                'cake.debugTask',
                'Default',
                fileName
            );
        });
    });

    function assertTaskCommand(
        task: CodeLens,
        expectedTitle: string,
        expectedCommand: string,
        expectedTaskName: string,
        expectedFileName: string
    ): void {
        let title = '',
            command = '',
            taskName = '',
            fileName = '';
        if (task && task.command && task.command.arguments) {
            title = task.command.title;
            command = task.command.command;
            taskName = task.command.arguments[0];
            fileName = task.command.arguments[1];
        }

        assert.equal(title, expectedTitle);
        assert.equal(command, expectedCommand);
        assert.equal(taskName, expectedTaskName);
        assert.equal(fileName, expectedFileName);
    }
}
