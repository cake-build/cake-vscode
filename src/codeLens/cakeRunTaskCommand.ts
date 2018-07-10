import * as os from 'os';
import { TerminalExecutor } from '../shared/utils';

export async function installCakeRunTaskCommand(
    taskName: string,
    fileName: string,
    runConfig: any
) {
    const buildCommand =
        os.platform() === 'win32'
            ? `powershell -ExecutionPolicy ByPass -File build.ps1 -script \"${fileName}\" -target \"${taskName}\" -verbosity ${runConfig.verbosity}`
            : `./build.sh --script=\"${fileName}\" --target=\"${taskName}\" --verbosity=${runConfig.verbosity}`;

    TerminalExecutor.runInTerminal(buildCommand);
}
