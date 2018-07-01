export default function flattenNestedArray(array: any) {
    return array.reduce(
        (flattened: any, item: any) =>
            flattened.concat(
                Array.isArray(item) ? flattenNestedArray(item) : item
            ),
        []
    );
}
