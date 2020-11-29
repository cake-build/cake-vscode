// This is an implementation of the QuickPickItem interface
// that is used to show the available bootstrappers.
// https://code.visualstudio.com/Docs/extensionAPI/vscode-api#QuickPickItem.

import { enums } from "../shared";

export class CakeBootstrapperInfo {
    private _id: string;
    private _name: string;
    private _type: enums.RunnerType;
    private _description: string;
    private _fileName: string;
    private _posix: boolean;

    constructor(
        id: string,
        name: string,
        type: enums.RunnerType,
        description: string,
        fileName: string,
        posix: boolean
    ) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._description = description;
        this._fileName = fileName;
        this._posix = posix;
    }

    get id(): string {
        return this._id;
    }

    get fileName(): string {
        return this._fileName;
    }

    get type(): enums.RunnerType {
        return this._type;
    }

    get posix(): boolean {
        return this._posix;
    }

    // QuickPickItem.description
    get description(): string {
        return this._fileName;
    }

    // QuickPickItem.detail
    get detail(): string {
        return this._description;
    }

    // QuickPickItem.label
    get label(): string {
        return this._name;
    }
}
