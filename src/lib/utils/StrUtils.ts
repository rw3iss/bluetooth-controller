export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Replaces given string with '*' characters, up to count.
 * @param {*} str
 * @param {?*} [count] Replaces up to min(count, str.length), if given, otherwise the entire string.
 * @returns {*}
 */
export const mask = (str, count?) => {
    if (!str?.length) return str;
    if (typeof count == 'undefined' || count > str.length) count = str.length;
    let r = '', pos = 0;
    while (pos < str.length && pos < count) { r += '*'; pos++; }
    while (pos < str.length) { r += str[pos]; pos++; }
    return r;
}