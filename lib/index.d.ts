import * as rx from 'rxjs';
declare type NestedObservableObj<T> = {
    [key: string]: NestedObservableObj<T> | NestedObservableArray<T> | rx.ObservableInput<T>;
};
declare type NestedObservableArray<T> = (NestedObservableObj<T> | NestedObservableArray<T> | rx.ObservableInput<T>)[];
declare type NestedObservable<T> = NestedObservableObj<T> | NestedObservableArray<T> | rx.ObservableInput<T>;
export declare function combineNested<T>(obss: NestedObservable<T>): any;
export {};
