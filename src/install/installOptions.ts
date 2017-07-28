export default class InstallOptions {
    constructor(public scriptName: string) {}
    installBootstrappers: boolean;
    installConfig: boolean;
}