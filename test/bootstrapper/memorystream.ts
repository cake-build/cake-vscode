import * as stream from "stream";

export class MemoryStream extends stream.Writable {
   private memBuffer : Buffer;
    constructor(opts?: stream.WritableOptions) {
       super(opts);
       this.memBuffer = new Buffer("");
    }

    toString() : string {
        return this.memBuffer.toString();
    }

     _write(chunk: any, encoding: string, callback: Function): void {
        //@ts-ignore TS2345
        let buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, encoding);

        this.memBuffer = Buffer.concat([this.memBuffer, buffer]);
        callback();
    }
}
