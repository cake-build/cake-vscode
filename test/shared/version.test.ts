import * as assert from 'assert';
import { Version } from '../../src/shared/version';

export default () => {
    suite('Version', () => {
        suite('numbered parts', () => {
            test('should get the set parts correctly', () => {
                const v = new Version(1,2,3);

                assert.strictEqual(v.getPart(0), 1);
                assert.strictEqual(v.getPart(1), 2);
                assert.strictEqual(v.getPart(2), 3);    
            });
            test('should have all not-set parts set to zero', () => {
                const v = new Version(1);

                assert.strictEqual(v.getPart(1), 0);
                assert.strictEqual(v.getPart(2), 0);    
                assert.strictEqual(v.getPart(3), 0);    
                assert.strictEqual(v.getPart(4), 0);    
            });
        });
        
        suite('named parts', () => {
            test('should have the major version set correctly', () => {
                const v = new Version(8,14,2);

                assert.strictEqual(v.major, 8);
            });
            test('should have the minor version set correctly', () => {
                const v = new Version(8,14,2);

                assert.strictEqual(v.minor, 14);    
            });
            test('should have the patch version set correctly', () => {
                const v = new Version(8,14,2);

                assert.strictEqual(v.patch, 2);    
            });
        });
        
        suite('parsing', () => {
            test('should throw on empty text', () => {                
                assert.throws(() => Version.parse(""));
            });
            test('should throw on non version', () => {
                assert.throws(() => Version.parse("ThisIsNoVersion"));
            });
            test('should throw on non-number versions postfix', () => {
                assert.throws(() => Version.parse("1.2.3xx"));
            });
            test('should throw on non-number versions prefix', () => {
                assert.throws(() => Version.parse("1.2.xx3"));
            });
            test('should parse a single number', () => {
                const v = Version.parse("2");

                assert.strictEqual(v.major, 2);
            });
            test('should parse a major.minor version', () => {
                const v = Version.parse("3.5");

                assert.strictEqual(v.major, 3);
                assert.strictEqual(v.minor, 5);
            });
            test('should parse a major.minor.patch version', () => {
                const v = Version.parse("7.103.54778");

                assert.strictEqual(v.major, 7);
                assert.strictEqual(v.minor, 103);
                assert.strictEqual(v.patch, 54778);
            });
            test('should parse a suffixed version', () => {
                const verText = "0.55.34-beta2";
                const v = Version.parse(verText);

                assert.strictEqual(v.getPart(0), 0);
                assert.strictEqual(v.getPart(1), 55);
                assert.strictEqual(v.getPart(2), 34);
                assert.strictEqual(v.getPart(3), 2);
                assert.strictEqual(v.toString(), verText);
            });
        });

        suite('comparing', () => {
            test('should be equal on the same version-object', () => {
                const v = new Version(1,2,3);

                const actual = v.equalTo(v);

                assert.strictEqual(actual, true);
            });

            test('should not be equal on null', () => {
                const v = new Version(1,2,3);

                const actual = v.equalTo(null as unknown as Version);

                assert.strictEqual(actual, false);
            });

            [{
                left: new Version(1,2,3),
                right: new Version(1,2,3),
                equal: true, 
            }, {
                left: new Version(1),
                right: new Version(1,0,0),
                equal: true, 
            }, {
                left: new Version(1,0,0,0),
                right: new Version(1),
                equal: true, 
            }, {
                left: new Version(1,2,3),
                right: new Version(2),
                equal: false, 
            }, {
                left: new Version(1,2,3),
                right: new Version(1,2,4),
                equal: false, 
            }, {
                left: Version.parse("1.0.0-alpha1"),
                right: Version.parse("1.0.0-beta1"),
                equal: true, 
            }].forEach(x => {
                test(`v${x.left.toString()} should be ${x.equal ? "equal": "not equal"} to v${x.right.toString()}`, () =>{
                    const actual = x.left.equalTo(x.right);
                    assert.strictEqual(actual, x.equal);
                });
            });

            [{
                left: new Version(1,2,3),
                right: new Version(1,2,3),
                orEqual: true,
                greaterThan: true, 
            }, {
                left: new Version(1),
                right: new Version(1,0,0),
                orEqual: true,
                greaterThan: true, 
            }, {
                left: new Version(1,0,0,0),
                right: new Version(1),
                orEqual: true,
                greaterThan: true, 
            }, {
                left: new Version(1,2,3),
                right: new Version(1,2,3),
                orEqual: false,
                greaterThan: false, 
            }, {
                left: new Version(1),
                right: new Version(1,0,0),
                orEqual: false,
                greaterThan: false, 
            }, {
                left: new Version(1,0,0,0),
                right: new Version(1),
                orEqual: false,
                greaterThan: false, 
            }, {
                left: new Version(1,2,3),
                right: new Version(2),
                orEqual: false,
                greaterThan: false, 
            }, {
                left: new Version(1,2,3),
                right: new Version(1,2,4),
                orEqual: false,
                greaterThan: false, 
            }, {
                left: new Version(1,2,3),
                right: Version.parse("1.2.3-rc1"),
                orEqual: true,
                greaterThan: false, 
            }].forEach(x => {
                test(`v${x.left.toString()} should be ${x.greaterThan ? "": "not "}greater ${x.orEqual ? "or equal " : "" }than v${x.right.toString()}`, () =>{
                    const actual = x.left.greaterThan(x.right, x.orEqual);
                    assert.strictEqual(actual, x.greaterThan);
                });
            });

            [{
                left: new Version(1,2,3),
                right: new Version(1,2,3),
                orEqual: true,
                lessThan: true, 
            }, {
                left: new Version(1),
                right: new Version(1,0,0),
                orEqual: true,
                lessThan: true, 
            }, {
                left: new Version(1,0,0,0),
                right: new Version(1),
                orEqual: true,
                lessThan: true, 
            }, {
                left: new Version(1,2,3),
                right: new Version(1,2,3),
                orEqual: false,
                lessThan: false, 
            }, {
                left: new Version(1),
                right: new Version(1,0,0),
                orEqual: false,
                lessThan: false, 
            }, {
                left: new Version(1,0,0,0),
                right: new Version(1),
                orEqual: false,
                lessThan: false, 
            }, {
                left: new Version(3,2,1),
                right: new Version(2),
                orEqual: false,
                lessThan: false, 
            }, {
                left: new Version(1,2,6),
                right: new Version(1,2,4),
                orEqual: false,
                lessThan: false, 
            }, {
                left: new Version(1,2,3),
                right: Version.parse("1.2.3-rc1"),
                orEqual: false,
                lessThan: true, 
            }].forEach(x => {
                test(`v${x.left.toString()} should be ${x.lessThan ? "": "not "}less ${x.orEqual ? "or equal " : "" }than v${x.right.toString()}`, () =>{
                    const actual = x.left.lessThan(x.right, x.orEqual);
                    assert.strictEqual(actual, x.lessThan);
                });
            });

            // now the special cases
            test('v0.38.5 should be less than v1.0.0-rc0001', () => {
                const left = Version.parse("0.38.5");
                const right = Version.parse("1.0.0-rc0001");

                const actual = left.lessThan(right);

                assert.strictEqual(actual, true);
            });
        });
    });
}
