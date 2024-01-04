function flattenInfinite(arr) {
    return arr.reduce((acc, current) => {
        if (Array.isArray(current)) {
            return acc.concat(flattenInfinite(current));
        } else {
            return acc.concat(current);
        }
    }, []);
}
