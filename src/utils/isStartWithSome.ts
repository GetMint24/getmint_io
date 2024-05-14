export const isStartWithSome = (sourceString: string, restStrings: string[]) => {
    for (const string of restStrings) {
        if (sourceString.startsWith(string)) {
            return true
        }
    }

    return false
}