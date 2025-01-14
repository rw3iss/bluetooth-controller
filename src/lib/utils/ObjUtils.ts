
/**
 * @description Tries to safely parse the json. Returns undefined if json is null or bad.
 * @param {*} json
 * @return {{} | undefined}
 */
export const tryJsonParse = (json, def: any = undefined) => {
    if (typeof json == 'string') {
        try {
            return JSON.parse(json);
        } catch (e) {
            // if it wasn't an object, consider it was a number or something, and return:
            if (json[0] != '{') { return json };
            console.warn('Warning: tryJsonParse failed: ', json, e);
            return def;
        }
    }
    // return the json, already as some other object, or the default.
    return json ?? def;
}

/**
 * @description Tries to safely stringify the json, and returns the string, or otherwise undefined.
 * @param {*} obj
 * @param {*} def default value to return if it fails.
 * @return {string | undefined}
 */
export const tryJsonStringify = (obj, def: string | undefined = undefined) => {
    if (typeof obj == 'string') {
        return obj;
    } else {
        try {
            return JSON.stringify(obj);
        } catch (e) {
            console.warn('Warning: tryJsonStringify failed: ', obj, e);
            return def;
        }
    }
}

export const tryParseInt = (int, def = undefined) => {
    try {
        return typeof int != 'undefined' ? parseInt(int) : def;
    } catch (e) {
        console.warn('Warning: tryParseInt failed: ', int, e);
    }
    return def;
}

export const tryParseFloat = (float, def = undefined) => {
    try {
        return typeof float != 'undefined' ? parseFloat(float) : def;
    } catch (e) {
        console.warn('Warning: tryParseFloat failed: ', float, e);
    }
    return def;
}


export const filterObjects = (objects, filter, returnArray = false) => {
    let result = {};
    if (!objects) return returnArray ? [] : {};
    Object.keys(objects).forEach(k => {
        let o = objects[k];
        if (filter(o)) {
            result[k] = o;
        }
    });
    return returnArray ? Object.values(result) : result;
}

export const clone = (o) => {
    try {
        return o ? JSON.parse(JSON.stringify(o)) : undefined;
    } catch (e) {
        console.log('Exception trying to clone object:', o, e);
        return undefined;
    }
}



// Return an object without the given array of properties.
export const excludeProps = (o, exclude) => {
    try {
        // convery data to json string
        let c = JSON.parse(JSON.stringify(o));
        exclude.forEach(e => {
            delete c[e];
        });
        return c;
    } catch (e) {
        console.error('EXCEPTION: Parsing JSON for tracking event:', e);
    }
}

export const pickProps = (o, pick: string[]) => {
    if (!o || typeof o != 'object') {
        return {};
    }

    let r = {};
    pick.forEach(p => {
        if (typeof o[p] != undefined) r[p] = o[p];
    });
    return r;
}

export const print = (o) => {
    if (!o) return '';
    if (typeof o == 'string') return o;
    return JSON.stringify(o);
    // todo: make better
}


