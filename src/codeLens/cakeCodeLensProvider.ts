'use strict';
import {
    CancellationToken,
    CodeLens,
    CodeLensProvider,
    Range,
    SymbolInformation,
    SymbolKind,
    Location,
    TextDocument,
    EventEmitter,
    Event
} from 'vscode';

export class CakeRunTaskCodeLens extends CodeLens {
    public constructor(range: Range, taskName: string, fileName: string) {
        super(range);

        this.command = {
            title: 'run task',
            command: 'cake.runTask',
            arguments: [taskName, fileName]
        };
    }
}

export class CakeDebugTaskCodeLens extends CodeLens {
    public constructor(range: Range, taskName: string, fileName: string) {
        super(range);

        this.command = {
            title: 'debug task',
            command: 'cake.debugTask',
            arguments: [taskName, fileName]
        };
    }
}

export class CakeCodeLensProvider implements CodeLensProvider {
    private _onDidChangeCodeLensesEmitter = new EventEmitter<void>();
    private _taskNameRegExp: RegExp;
    public showCodeLens: boolean = false;

    public constructor(taskRegExp: string) {
        this._taskNameRegExp = new RegExp(taskRegExp, 'g');
    }

    private _getSymbols(document: TextDocument): SymbolInformation[] {
        const symbols: SymbolInformation[] = [];

        for (let i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            let matches = this._taskNameRegExp.exec(line.text);
            if (matches) {
                symbols.push(
                    new SymbolInformation(
                        matches[1],
                        SymbolKind.Method,
                        'TasksContainer',
                        new Location(document.uri, line.range)
                    )
                );
            }
        }

        return symbols;
    }

    public provideCodeLenses(
        document: TextDocument,
        token: CancellationToken
    ): CodeLens[] | Thenable<CodeLens[]> {
        const mapped: CodeLens[] = [];

        if(!this.showCodeLens) {
            return mapped;
        }

        return new Promise((resolve, reject) => {
            if (!document) {
                return reject('No open document in the workspace');
            }

            if (token.isCancellationRequested) {
                return resolve(mapped);
            }

            const symbols = this._getSymbols(document);

            symbols.forEach(symbol => {
                mapped.push(
                    new CakeRunTaskCodeLens(
                        symbol.location.range,
                        symbol.name,
                        document.fileName
                    )
                );
                mapped.push(
                    new CakeDebugTaskCodeLens(
                        symbol.location.range,
                        symbol.name,
                        document.fileName
                    )
                );
            });

            return resolve(mapped);
        });
    }


    public get onDidChangeCodeLenses(): Event<void> {
        return this._onDidChangeCodeLensesEmitter.event;
    }

    public resolveCodeLens(
        codeLens: CodeLens,
        token: CancellationToken
    ): CodeLens {
        if (token.isCancellationRequested) {
            return codeLens;
        }

        return codeLens;
    }

    public dispose() {
    }
}
