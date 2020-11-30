import { ExtensionContext } from 'vscode';
import { enums } from '../shared';

export default class InstallOptions {
    constructor(public scriptName: string, public context: ExtensionContext) { }
    installBootstrappers!: boolean;
    bootstrapperType!: enums.RunnerType;
    installConfig!: boolean;
    installDebug!: boolean;
    debuggerType!: enums.DebugType;
}
