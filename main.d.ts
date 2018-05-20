export declare type Maybe<T> = T | undefined;
export declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare type JSONPrimitiveValue = null | undefined | string | number | boolean | Date;
export interface JSONObject {
    [key: string]: JSONPrimitiveValue | JSONObject | JSONArray;
}
export interface JSONArray extends Array<JSONPrimitiveValue | JSONObject | JSONArray> {
}
export declare type JSONCompoundValue = JSONObject | JSONArray;
export declare type JSONValue = JSONCompoundValue | JSONPrimitiveValue;
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type Overwrite<T1, T2> = {
    [P in Exclude<keyof T1, keyof T2>]: T1[P];
} & T2;
export declare type Runnable = () => void;
export declare type TypedFunction<T, R> = (arg: T) => R;
export declare type TypedBiFunction<T, S, R> = (arg1: T, arg2: S) => R;
export declare type TypedTriFunction<T, S, U, R> = (arg1: T, arg2: S, arg3: U) => R;
export declare type Supplier<T> = () => T;
export declare type BiSupplier<T, S> = () => Pair<T, S>;
export declare type TriSupplier<T, S, U> = () => Triple<T, S, U>;
export declare type Consumer<T> = (item: T) => void;
export declare type BiConsumer<T, S> = (item1: T, item2: S) => void;
export declare type TriConsumer<T, S, U> = (item1: T, item2: S, item3: U) => void;
export declare type UnaryOperator<T> = TypedFunction<T, T>;
export declare type BinaryOperator<T> = TypedBiFunction<T, T, T>;
export declare type Predicate<T> = (item: T) => boolean;
export declare type BiPredicate<T, S> = (item1: T, item2: S) => boolean;
export declare type TriPredicate<T, S, U> = (item1: T, item2: S, item3: U) => boolean;
export declare type Equator<T> = (lhs: T, rhs: T) => boolean;
export declare type Comparator<T> = (lhs: T, rhs: T) => number;
export declare type KeyExtractor<T, K> = (item: T) => K;
export declare type Single<T1> = [T1];
export declare type Pair<T1, T2> = [T1, T2];
export declare type Triple<T1, T2, T3> = [T1, T2, T3];
export declare type Quadruple<T1, T2, T3, T4> = [T1, T2, T3, T4];
export declare type Quintuple<T1, T2, T3, T4, T5> = [T1, T2, T3, T4, T5];
export declare type Sextuple<T1, T2, T3, T4, T5, T6> = [T1, T2, T3, T4, T5, T6];
export declare type Septuple<T1, T2, T3, T4, T5, T6, T7> = [T1, T2, T3, T4, T5, T6, T7];
export declare type Octuple<T1, T2, T3, T4, T5, T6, T7, T8> = [T1, T2, T3, T4, T5, T6, T7, T8];
export declare type Nonuple<T1, T2, T3, T4, T5, T6, T7, T8, T9> = [T1, T2, T3, T4, T5, T6, T7, T8, T9];
export declare type Decuple<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10];
export declare type KeyValuePair<K, V> = Pair<K, V>;
export interface KeyValueEntry<K, V> {
    key: K;
    value: V;
}
export interface StringObject<T> {
    [key: string]: T;
}
export interface NumberObject<T> {
    [key: number]: T;
}
export interface Comparable<T> {
    compareTo(rhs: T): number;
}
export interface DeletableIterator<T> extends Iterator<T> {
    next(remove?: boolean): IteratorResult<T>;
}
export interface DeletableIterable<T> extends Iterable<T> {
    [Symbol.iterator](): DeletableIterator<T>;
}
export interface DeletableIterableIterator<T> extends IterableIterator<T>, DeletableIterator<T> {
    next(remove?: boolean): IteratorResult<T>;
    [Symbol.iterator](): DeletableIterableIterator<T>;
}
export interface Collector<S, T, R> {
    accumulator: BiConsumer<T, S>;
    supplier: Supplier<T>;
    finisher: TypedFunction<T, R>;
}
export interface Vector1 {
    x: number;
}
export interface Vector2 {
    x: number;
    y: number;
}
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}
export interface Vector4 {
    x1: number;
    x2: number;
    x3: number;
    x4: number;
}
export interface Vector5 {
    x1: number;
    x2: number;
    x3: number;
    x4: number;
    x5: number;
}
