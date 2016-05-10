'use strict';

var request = require('request');
import vscode = require('vscode');

// This is an implementation of the QuickPickItem interface
// that is used to show the available bootstrappers.
// https://code.visualstudio.com/Docs/extensionAPI/vscode-api#QuickPickItem.

export class CakeBootstrapperInfo {

    private _platform: string;
    private _name: string;
    private _fileName: string;

    constructor(platform: string, name: string, fileName: string) {
        this._platform = platform;
        this._name = name;
        this._fileName = fileName;
    }

    get platform(): string {
        return this._platform;
    }

    get fileName(): string {
        return this._fileName;
    }

    // QuickPickItem.description
    get description(): string {
        return this._fileName;
    }

    // QuickPickItem.detail
    get detail(): string {
        return null;
    }

    // QuickPickItem.label
    get label(): string {
        return this._name;
    }
}