/**
 * represents a version that can be compared to other versions.
 */
export class Version {

    private parts: number[] = [];
    private suffixTxt: string|null = null;
    private suffix: number|null = null;
    private static readonly suffixMatcher = new RegExp(/-(\D+)(\d+)/); // https://regex101.com/r/nrjWum/1

    constructor(...parts: number[]) {
        this.parts = parts;        
    }

    /**
     * parses a version string into a @see Version.
     * @param text the sting to parse.
     */
    public static parse(text: string): Version {
        if(!text){
            throw new Error("text can not be empty.");
        }

        let suffixText:string|null = null;
        let suffix = 0;
        const suffixMatch = this.suffixMatcher.exec(text);
        if(suffixMatch) {
            suffixText = suffixMatch[1];
            suffix = Number.parseInt(suffixMatch[2], 10);
        }

        const txtParts = text.split("-", 2)[0].split(".");
        const parts = txtParts.map((x) => {
            const num = Number.parseInt(x, 10);
            if(Number.isNaN(num)){
                throw new Error(`could not parse ${x} as part of a version.`);
            }

            if(num.toString(10) !== x){
                throw new Error(`error parsing: ${x} was parsed as ${num}.`);
            }

            return num;
        });

        const ver = new Version(...parts);

        if(suffixText !== null) {
            ver.suffixTxt = suffixText;
            ver.suffix = suffix;
        }

        return ver;
    }

    /**
     * @override 
     */
    public toString(): string {
        let s = this.parts.join(".");
        if(this.suffixTxt != null){
            s += "-"+this.suffixTxt+this.suffix;
        }

        return s;
    }

    /**
     * tests the other version for equality with this version.
     * @param other the version to compare with.
     */
    public equalTo(other: Version): boolean {
        if(!other){
            return false;
        }

        const count = Math.max(this.partCount, other.partCount);

        for(let i=0; i<count; i++) {
            const left = this.getPart(i);
            const right = other.getPart(i);

            if(left !== right) {
                return false;
            }
        }

        return true;
    }

    /**
     * tests if this version is greater/greaterEqual than the other version.
     * @param other 
     */
    public greaterThan(other: Version, orEqual=false): boolean {
        if(!other){
            return false;
        }

        const count = Math.max(this.partCount, other.partCount);

        for(let i=0; i<count; i++) {
            const left = this.getPart(i);
            const right = other.getPart(i);

            if(left > right) {
                return true;
            }
            if(left < right) {
                return false;
            }
        }

        return orEqual;
    }

    /**
     * tests if this version is less/lessEqual than the other version.
     * @param other 
     */
    public lessThan(other: Version, orEqual=false): boolean {
        if(!other){
            return false;
        }

        const count = Math.max(this.partCount, other.partCount);

        for(let i=0; i<count; i++) {
            const left = this.getPart(i);
            const right = other.getPart(i);

            if(left < right) {
                return true;
            }
            if(left > right) {
                return false;
            }
        }

        return orEqual;
    }

    /**
     * returns the n-th part of the version, counted from left, starting at 0.
     * (so "major" would be 0, "minor" would be 1).
     * @param i the part-number of the version, or 0 if the part does not exist.
     */
    public getPart(i: number){
        if(i<this.parts.length){
            return this.parts[i];
        }
        if(i==this.parts.length && this.suffix != null){
            return this.suffix;
        }

        return 0;
    }

    /**
     * gets the count of the parts of this version.
     */
    public get partCount(): number {
        return this.parts.length + (this.suffix === null ? 0 : 1);
    }

    /**
     * returns the major version number. Equal to calling `getPart(0)`.
     */
    public get major(): number {
       return this.getPart(0);
    }

    /**
     * returns the minor version number. Equal to calling `getPart(1)`.
     */
    public get minor(): number {
        return this.getPart(1);
    }

    /**
     * returns the patch version number. Equal to calling `getPart(2)`.
     */
    public get patch(): number {
        return this.getPart(2);
    }
}