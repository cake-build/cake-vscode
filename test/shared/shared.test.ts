import describeUtilsTests from './utils/utils.test';

export default function describeSharedTests() {
    suite('Shared', function() {
        describeUtilsTests();
    });
}
