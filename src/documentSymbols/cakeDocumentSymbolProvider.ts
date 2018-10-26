'use strict';

import { DocumentSymbolProvider, TextDocument, CancellationToken, SymbolInformation, SymbolKind, Location } from 'vscode';

export class CakeDocumentSymbolProvider implements DocumentSymbolProvider {

    public provideDocumentSymbols(document: TextDocument, token: CancellationToken): Promise<SymbolInformation[]> {
        
        return new Promise((resolve, reject) => {
            const symbols: SymbolInformation[] = [];

            if (!document) {
                return reject('No open document in the workspace');
            }

            if (token.isCancellationRequested) {
                return resolve(symbols);
            }    
            
            for (var i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i)
                const match = this.matchFunction(line.text);
                if (match !== null) {
                    symbols.push(new SymbolInformation(
                        match[1],
                        SymbolKind.Function,
                        "TaskContainer",
                        new Location(document.uri, line.range)
                    ));
                }
            }

            resolve(symbols);
        });
    }

    public matchFunction(line: string) {
        const function_regex = "Task\\s*?\\(\\s*?\"(.*?)\"\\s*?\\)"
        return line.match(function_regex)
    }
}
