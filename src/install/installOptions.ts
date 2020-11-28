import { enums } from '../shared';

export default class InstallOptions {
    constructor(public scriptName: string) { }
    installBootstrappers!: boolean;
    bootstrapperType!: enums.RunnerType;
    installConfig!: boolean;
    installDebug!: boolean;
}
