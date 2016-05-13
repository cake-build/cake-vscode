'use strict';

var request = require('request');
import vscode = require('vscode');

// This is an implementation of the QuickPickItem interface
// that is used to show the available bootstrappers.
// https://code.visualstudio.com/Docs/extensionAPI/vscode-api#QuickPickItem.

export class CakeBootstrapperInfo {

    private _id: string;
    private _name: string;
    private _description: string;
    private _fileName: string;
    private _posix: boolean;

    constructor(id: string, name: string, description: string, fileName: string, posix: boolean) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._fileName = fileName;
        this._posix = posix
    }

    get id(): string {
        return this._id;
    }

    get fileName(): string {
        return this._fileName;
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