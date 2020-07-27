"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineNested = void 0;
const rx = require("rxjs");
const rxo = require("rxjs/operators");
function startNull(obs) {
    return obs.pipe(rxo.startWith(null));
}
function isObs(o) {
    return o.pipe !== undefined;
}
function toObj(keys, ...values) {
    let obj = {};
    keys.forEach((key, i) => {
        obj[key] = values[i];
    });
    return obj;
}
;
function combineObj(obss) {
    const combined_obss = Object.values(obss).map((obs) => {
        if (isObs(obs)) {
            return startNull(obs);
        }
        else {
            return combineNested(obs);
        }
    });
    return rx.combineLatest(...combined_obss, toObj.bind(null, Object.keys(obss)));
}
;
function combineArray(obss) {
    const combined_obss = obss.map((obs) => {
        if (isObs(obs)) {
            return startNull(obs);
        }
        else {
            return combineNested(obs);
        }
    });
    return rx.combineLatest(...combined_obss);
}
function combineNested(obss) {
    if (isObs(obss)) {
        return obss;
    }
    else if (Array.isArray(obss)) {
        return combineArray(obss);
    }
    else {
        return combineObj(obss);
    }
}
exports.combineNested = combineNested;
//# sourceMappingURL=index.js.map