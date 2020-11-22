'use strict';

import { 
    DocumentSymbolProvider, 
    TextDocument, 
    CancellationToken, 
    SymbolKind, 
    DocumentSymbol,
    Range
} from 'vscode';
import { ICodeSymbolsSettings } from '../extensionSettings'

export class CakeDocumentSymbolProvider implements DocumentSymbolProvider {
    private ctxRegEx!: RegExp;
    private taskRegEx!: RegExp;
    
    public constructor(config: ICodeSymbolsSettings) {
        this.reconfigure(config);
    }

    public reconfigure(config: ICodeSymbolsSettings){
        this.ctxRegEx = new RegExp(config.contextRegularExpression, 'gm');
        this.taskRegEx = new RegExp(config.taskRegularExpression, 'gm');
    }

    public provideDocumentSymbols(document: TextDocument, token: CancellationToken): Promise<DocumentSymbol[]> {
        
        return new Promise((resolve, reject) => {
            let context = new DocumentSymbol("Context", "Context functions", SymbolKind.Namespace, new Range(0, 0, 0, 0), new Range(0, 0, 0, 0));
            let tasks = new DocumentSymbol("Tasks", "Task functions", SymbolKind.Namespace, new Range(0, 0, 0, 0), new Range(0, 0, 0, 0));

            const symbols: DocumentSymbol[] = [];
            symbols.push(context, tasks);

            if (!document) {
                return reject('No open document in the workspace');
            }
 
            for (var i = 0; i < document.lineCount; i++) {
                if (token.isCancellationRequested) {
                    return resolve(symbols);
                }  
                
                const line = document.lineAt(i)
                let match = this.matchTask(line.text);
                if (match !== null) {
                    tasks.children.push(new DocumentSymbol(
                        match[1],
                        "",
                        SymbolKind.Function,
                        line.range,
                        line.range
                    ));
                } else {
                    match = this.matchContext(line.text);
                    if(match !== null) {
                        context.children.push(new DocumentSymbol(
                            match[0],
                            "",
                            SymbolKind.Function,
                            line.range,
                            line.range
                        ))

                    }


                }
            }

            resolve(symbols);
        });
    }

    private matchTask(line: string) {
        return this.taskRegEx.exec(line);
    }

    private matchContext(line: string) {
        return this.ctxRegEx.exec(line);
    }
}
