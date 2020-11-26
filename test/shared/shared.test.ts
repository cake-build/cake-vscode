import describeUtilsTests from './utils/utils.test';
import describeVersionTests from './version.test';

export default function describeSharedTests() {
    suite('Shared', function() {
        describeUtilsTests();
        describeVersionTests();
    });
}
