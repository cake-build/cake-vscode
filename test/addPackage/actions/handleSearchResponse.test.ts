import * as assert from 'assert';
import { Response } from 'node-fetch';
import { handleSearchResponse } from '../../../src/addPackage/actions';

export default function describeHandleSearchResponseTests() {
    suite('handleSearchResponse', function() {
        test('should return a rejected promise when response.ok is false', function(done) {
            (handleSearchResponse({ ok: false } as Response) as Promise<never>).catch(()=> {
                assert.equal(true, true);
                done();
            });
        });
        test('should call response.json when response.ok is truthy', function(done) {
            handleSearchResponse({
                ok: true,
                json: () => {
                    assert.equal(true, true);
                    done();
                }
            } as Response);
        });
    });
}
