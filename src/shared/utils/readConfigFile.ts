import { Config } from './config';
import * as path from 'path';
import * as fs from 'fs';
import * as ini from 'ini';
import {
    CAKE_CONFIG_NAME,
    CAKE_DEFAULT_TOOLS_PATH,
    CAKE_DEFAULT_ADDINS_PATH,
    CAKE_DEFAULT_MODULES_PATH
} from '../../constants';

function _getEmptyCakeCakeConfig() {
    return {
        Nuget: {
            Source: '',
            UseInProcessClient: false,
            LoadDependencies: false
        },
        Paths: {
            Tools: '',
            Addins: '',
            Modules: ''
        },
        Settings: { SkipVerification: false }
    };
}

function _getDefaultCakeConfig() {
    return {
        Nuget: {
            Source: '',
            UseInProcessClient: false,
            LoadDependencies: false
        },
        Paths: {
            Tools: CAKE_DEFAULT_TOOLS_PATH,
            Addins: CAKE_DEFAULT_ADDINS_PATH,
            Modules: CAKE_DEFAULT_MODULES_PATH
        },
        Settings: { SkipVerification: false }
    };
}

export function readConfigFile<T>(
    folderPath: string | undefined,
    fileName: string
): T | undefined {
    if (!folderPath || !fs.existsSync(path.join(folderPath, fileName))) {
        return undefined;
    }
    return ini.parse(fs.readFileSync(path.join(folderPath, fileName), 'utf-8')) as T;
}

export function readCakeConfigFile(folderPath: string | undefined): Config {
    return !folderPath
        ? _getEmptyCakeCakeConfig()
        : readConfigFile<Config>(folderPath, CAKE_CONFIG_NAME) ||
              _getDefaultCakeConfig();
}
