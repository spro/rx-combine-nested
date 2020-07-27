import * as rx from 'rxjs';
import * as rxo from 'rxjs/operators';

type Obj<T> = {
    [key: string]: T
};

type NestedObj<T> = {
    [key: string]: NestedObj<T> | T
};

type NestedObservableObj<T> = {
    [key: string]: NestedObservableObj<T> | NestedObservableArray<T> | rx.ObservableInput<T>
};

type NestedObservableArray<T> =
    (NestedObservableObj<T> | NestedObservableArray<T> | rx.ObservableInput<T>)[];

type NestedObservable<T> =
    NestedObservableObj<T> | NestedObservableArray<T> | rx.ObservableInput<T>;

type ObsCombiner<T> =
    (...values: T[]) => NestedObj<T>;

function startNull(obs) {
    return obs.pipe(rxo.startWith(null));
}

function isObs(o): boolean {
    return o.pipe !== undefined;
}

function toObj<T>(keys: [string], ...values: T[]): NestedObj<T> {
    let obj: Obj<T> = {};
    keys.forEach((key, i) => {
        obj[key] = values[i];
    });
    return obj;
};

function combineObj<T>(obss: NestedObservableObj<T>) {
    const combined_obss = Object.values(obss).map((obs) => {
        if (isObs(obs)) {
            return startNull(<rx.ObservableInput<T>>obs);
        } else {
            return combineNested(<NestedObservableObj<T>>obs);
        }
    });
    return rx.combineLatest(
        ...combined_obss,
        toObj.bind(null, Object.keys(obss))
    );
};

function combineArray<T>(obss: NestedObservableArray<T>) {
    const combined_obss = obss.map((obs) => {
        if (isObs(obs)) {
            return startNull(<rx.ObservableInput<T>>obs);
        } else {
            return combineNested(<NestedObservableObj<T>>obs);
        }
    });
    return rx.combineLatest(
        ...combined_obss
    );
}

export function combineNested<T>(obss: NestedObservable<T>) {
    if (isObs(obss)) {
        return <rx.ObservableInput<T>>obss;
    } else if (Array.isArray(obss)) {
        return combineArray(<NestedObservableArray<T>>obss);
    } else {
        return combineObj(<NestedObservableObj<T>>obss);
    }
}

