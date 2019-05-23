/**
 * Represents an optional value. Absence of the value is indicated
 * by `undefined`. JavaScript provides tow different types for the notion of
 * absende, namely `null` and `undefined`, with minor semantic differences.
 * However, for the sake of clarity and simplicity, I am in favor of using only
 * one type whenever a value is absent. `undefined` is suited better as it is
 * the default value when declaring a variable and used for optional function
 * parameters.
 *
 * Consider enabling `strictNullChecks` with typescript to check for possibly
 * undefined values.
 *
 * ```typescript
 * function getLength(word: Maybe<string>) {
 *   return word !== undefined ? word.length : 0;
 * }
 * ```
 *
 * @typeparam T Type of the optionally present value.
 */
export declare type Maybe<T> = T | undefined;
/**
 * An optional return type for functions that must either
 * explicitly return a value of a certain type; or not
 * have a return statement. Note that a function without
 * a return statement will return `undefined` when called.
 *
 * Contrast this with `Maybe<T>`: Even if the return type
 * is declared as `undefined`, the function must still contain
 * an explicit `return undefined` statement.
 *
 * ```typescript
 * interface UndoableAction {
 *   perform(): Voidable<Promise<void>>;
 *   undo(): Voidable<Promise<void>>;
 * }
 * ```
 *
 * The above interface defines an action that can be undone. An action
 * never return a value, it only performs some side effects. It also
 * supports asynchronous actions by returning a promise.
 */
export declare type Voidable<T> = T | void;
/**
 * Represents the constructor a class, ie. the `constructor functions that
 * returns a new instance of the class.
 *
 * ```typescript
 * // Creates a new instance and injects all dependencies.
 * function create<T>(container: Constructor<T>, ...args: []) {
 *   const instance = new container(...args);
 *   // inject some properties
 *   return instance;
 * }
 * ```
 *
 * @typeparam T Type of the objects created by the constructor.
 */
export declare type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * Interface for builders that create configured objects. Other instance
 * methods should return `this` for chaining.
 * @typeparam T Type of the objects that this builder builds.
 */
export interface Builder<T> {
    build(): T;
}
/** A primitive JSON value. */
export declare type JSONPrimitiveValue = null | undefined | string | number | boolean | Date;
/** A JSON object. */
export interface JSONObject {
    [key: string]: JSONPrimitiveValue | JSONObject | JSONArray;
}
/** A JSON array. */
export interface JSONArray extends Array<JSONPrimitiveValue | JSONObject | JSONArray> {
}
/** A JSON compound value (JSONArray or JSONObject). */
export declare type JSONCompoundValue = JSONObject | JSONArray;
/** A JSON value (primitive or compound). */
export declare type JSONValue = JSONCompoundValue | JSONPrimitiveValue;
/**
 * Consider an object with some known property keys. A partial is another
 * object that may contain none or only some of these keys, but no keys not
 * present in the original object. This is what the built-in type `Partial`
 * provides. A deep partial generalize this notion to nested properties.
 *
 * ```typescript
 * // Represents a physical address of a building etc.
 * class Address() {
 *   constructor(public country: string, public city: string, public street: string) {}
 * }
 *
 * // Represents a user with an ID, a name, and a date of birth.
 * class User {
 *   constructor(public id: number, public name: string, residence: Address) {}
 * }
 *
 * // A function that searches a user matching some criteria. By using a
 * // DeepPartial, `typescript` allows only keys and properties that are
 * // part of a User. It also checks whether the type of the property is
 * // correct.
 * function findUserBy(criteria: DeepPartial<User>) {
 *   // to be implemented, read from a database or in-memory
 *   return user;
 * }
 *
 * // Now we can query users by their propeties.
 * findUserBy({
 *   id: 9,
 * });
 *
 * findUserBy({
 *   name: "Masahiko",
 *   residence: {
 *     country: "Japan",
 *   }
 * });
 *
 * findUserBy({
 *   residence: {
 *     city: "London",
 *     street: "Baker Street",
 *   }
 * });
 * ```
 *
 * @typeparam T Type of the object for which a partial view is created.
 */
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
/**
 * From T omit a set of properties K.
 *
 * ```typescript
 * // Takes a vector3 that does not need to have a z-coordinate.
 * function projectToXY(vector: Omit<Vector3, "z"): Vector2 {
 *   return {x: vector.x, y: vector.y};
 * }
 * ```
 *
 * @typeparam T Type of the base type from which to omit a property key.
 * @typeparam K Type of the key to omit.
 */
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * A type without all properties of the other type.
 *
 * ```typescript
 * interface Options {
 *   id: number;
 *   name: string;
 *   mail: string;
 * }
 *
 * interface InternalOptions {
 *   id: number;
 * }
 *
 * let idProvider = 0;
 * function createOptions<T>(additionalOptions: Partial<RemoveFrom<Options, InternalOptions>> = {}): Options {
 *   return {
 *     id: idProvider++,
 *     mail: additionalOptions.mail || "foo@example.com"
 *     name: additionalOptions.name || "foo",
 *   };
 * }
 *
 * // ...
 *
 * const opts1 = createOptions({name: "blutorange"}); // WORKS
 * const opts2 = createOptions({id: 1}) // TYPE ERROR
 * ```
 * @typeparam T Type of the base type.
 * @typeparam K Type whose properties are removed from T.
 */
export declare type RemoveFrom<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
/**
 * Makes every property optional, except for the given ones.
 *
 * ```typescript
 * interface Entity {
 *   id: number;
 *   uuid: string;
 * }
 *
 * interface User extends Entity {
 *   username: string;
 *   active: boolean;
 *   age: number;
 *   mail: string;
 *   name: string;
 *   // ...
 * }
 *
 * // Same as PartialExcept<User, "id" | "uuid">
 * function createEntity<T extends Entity>(data: PartialExcept<User, keyof Entity>) {
 *   // ...
 * }
 *
 *
 * createEntity({id: 1, uuid: "foo"}); // works
 * createEntity({id: 1, age: 9}); // error: property uuid is missing
 * ```
 *
 * @typeparam T Type of the base type.
 * @typeparam K Type whose properties are not made partial in T.
 */
export declare type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;
/**
 * Makes every given property readonly, except for the given properties.
 *
 * ```typescript
 * interface User {
 *   username: string;
 *   active: boolean;
 *   age: number;
 *   mail: string;
 *   name: string;
 *   // ...
 * }
 *
 * // Makes all properties but age and mail readonly.
 * declare const user: ReadonlyExcept<User, "age" | "mail">;
 * ```
 *
 * @typeparam T Type of the base type.
 * @typeparam K Type whose properties are not made readonly in T.
 */
export declare type ReadonlyExcept<T, K extends keyof T> = Readonly<Omit<T, K>> & Pick<T, K>;
/**
 * Makes every given property optional.
 *
 * ```typescript
 * interface User {
 *   username: string;
 *   active: boolean;
 *   age: number;
 *   mail: string;
 *   name: string;
 *   // ...
 * }
 *
 * // Makes the properties age and mail optional.
 * declare const user: PartialFor<User, "age" | "mail">;
 * ```
 *
 * @typeparam T Type of the base type.
 * @typeparam K Type whose properties are made partial in T.
 */
export declare type PartialFor<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * Makes every given property readonly.
 *
 * ```typescript
 * interface User {
 *   username: string;
 *   active: boolean;
 *   age: number;
 *   mail: string;
 *   name: string;
 *   // ...
 * }
 *
 * // Makes the properties age and mail readonly.
 * declare const user: ReadonlyFor<User, "age" | "mail">;
 * ```
 *
 * @typeparam T Type of the base type.
 * @typeparam K Type whose properties are made readonly in T.
 */
export declare type ReadonlyFor<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;
export declare type RequiredFor<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
/**
 * Gives all property keys whose types match the given type.
 *
 * ```typescript
 * interface User {
 *   active: boolean;
 *   age: number;
 *   mail: string;
 *   name: string;
 *   username: string;
 * }
 *
 * function foo(stringKey: MatchingKeys<User, string>) {
 *   // Variable stringKey now has the type
 *   // "mail" | "name" | "username"
 *   const b1 = stringKey === "mail"; // works
 *   const b2 = stringKey === "name"; // works
 *   const b3 = stringKey === "username"; // works
 *   // [ts] Operator '===' cannot be applied to types '"mail" | "name" | "username"' and '"active"'.
 *   const b4 = stringKey === "active";
 * }
 *
 * // Variable advanced now has the type
 * // "mail" | "name"
 * declare const advanced = MatchingKeys<User, string, "age" | "mail" | "name">;
 * ```
 *
 * @typeparam TRecord Type of the base type. This is the type whose keys are searched for a match.
 * @typeparam TMatch Type to match the keys of the record against.
 * @typeparam K Keys are considered in the output. Defaults to the keys of the record.
 */
export declare type MatchingKeys<TRecord, TMatch, K extends keyof TRecord = keyof TRecord> = K extends (TRecord[K] extends TMatch ? K : never) ? K : never;
/**
 * Gives all property keys to which the given type can be assigned.
 *
 * ```typescript
 * interface User {
 *   age: string | number;
 *   email: string | undefined;
 *   active?: boolean;
 * }
 *
 * // A string can be assigned to the properties age and email.
 * type userString = AssignableKeys<User, string>; // "age"|"email"
 *
 * // undefined can be assigned only to the properties email and active.
 * type userUndefined = AssignableKeys<User, string>; // "email"|"active"
 * ```
 *
 * @typeparam TRecord Type of the base type. This is the type whose keys are searched for a match.
 * @typeparam TMatch Type to match the keys of the record against.
 * @typeparam K Keys are considered in the output. Defaults to the keys of the record.
 */
export declare type AssignableKeys<TRecord, TMatch, K extends keyof TRecord = keyof TRecord> = K extends (TMatch extends TRecord[K] ? K : never) ? K : never;
export declare type UnassignableKeys<TRecord, TMatch, K extends keyof TRecord = keyof TRecord> = K extends (TMatch extends TRecord[K] ? K : never) ? never : K;
/**
 * Shortcut for `AssignableKeys<TRecord, undefined, K>`. Gives all property keys
 * that are optional, ie. to which `undefined` can be assigned.
 *
 * ```typescript
 * interface Data {
 *   foo: number;
 *   bar?: number;
 *   baz: string|undefined;
 * }
 *
 * // "bar"|"baz"
 * type PartialData = PartialKeys<Data>;
 * ```
 *
 * @typeparam TRecord Type of the base type. This is the type whose keys are searched for a match.
 * @typeparam K Keys are considered in the output. Defaults to the keys of the record.
 */
export declare type PartialKeys<TRecord, K extends keyof TRecord = keyof TRecord> = AssignableKeys<TRecord, undefined, K>;
export declare type RequiredKeys<TRecord, K extends keyof TRecord = keyof TRecord> = UnassignableKeys<TRecord, undefined, K>;
/**
 * From TRecord, pick a set of properties to which the given type can be assigned.
 *
 * ```typescript
 * interface Data {
 *   foo: string | number;
 *   bar?: number;
 *   baz: string;
 * }
 *
 * // {foo: string|number, baz: string}
 * type StringData = PickAssignable<Data, string>;
 * ```
 *
 * @typeparam TRecord Type of the base type. This is the type whose keys are searched for a match.
 * @typeparam TMatch Type to match the keys of the record against.
 * @typeparam K Keys are considered in the output. Defaults to the keys of the record.
 */
export declare type PickAssignable<TRecord, TMatch, K extends keyof TRecord = keyof TRecord> = Pick<TRecord, AssignableKeys<TRecord, TMatch, K>>;
/**
 * From TRecord, pick a set of properties that match the given type.
 *
 * ```typescript
 * interface Data {
 *   foo: string | number;
 *   bar?: number;
 *   baz: string;
 * }
 *
 * // {baz: string}
 * type StringData = PickAssignable<Data, string>;
 * ```
 *
 * @typeparam TRecord Type of the base type. This is the type whose keys are searched for a match.
 * @typeparam TMatch Type to match the keys of the record against.
 * @typeparam K Keys are considered in the output. Defaults to the keys of the record.
 */
export declare type PickMatching<TRecord, TMatch, K extends keyof TRecord = keyof TRecord> = Pick<TRecord, MatchingKeys<TRecord, TMatch, K>>;
/**
 * Pick the set of properties that are optional, eg. to which `undefined` can be assigned.
 *
 * ```typescript
 * abstract class Model<TAttributes> {
 *  private attributes: TAttributes;
 *  constructor(attributes: TAttributes) {
 *    this.attributes = Object.assign({}, this.getDefaults(), attributes);
 *  }
 *  // Must return defaults for all optional attributes.
 *  abstract getDefaults(): Required<PickPartial<TAttributes>>;
 * }
 *
 * interface UserAttributes {
 *   username: string;
 *   age?: number;
 *   email?: string;
 * }
 *
 * class UserModel extends Model<UserAttributes> {
 *   getDefaults() {
 *     return {
 *       email: "johndoe@example.com",
 *       age: 18,
 *     };
 *   }
 * }
 * ```
 * @typeparam TRecord Type of the base type. This is the type whose keys are searched for a match.
 * @typeparam K Keys are considered in the output. Defaults to the keys of the record.
 */
export declare type PickPartial<TRecord, K extends keyof TRecord = keyof TRecord> = Pick<TRecord, PartialKeys<TRecord, K>>;
export declare type PickRequired<TRecord, K extends keyof TRecord = keyof TRecord> = Pick<TRecord, RequiredKeys<TRecord, K>>;
/**
 * Takes a type and create a new type with some properties overwritten with a different type.
 *
 * ```typescript
 * // Somewhere options are defined, and only an ID is required.
 * interface Options {
 *   id: number,
 *   foo?: string,
 *   bar?: string,
 * }
 *
 * // ...
 *
 * // Now we want to create a function that takes an `Options` object,
 * // but with the foo property mandatory.
 * function createOptions(opts: Overwrite<Options, {foo: string}) {
 *   console.log(opts.foo) // Now opts.foo cannot be undefined.
 * }
 * ```
 *
 * @typeparam T1 Type to be overwritten.
 * @typeparam T2 Type with properties that overwrite those of the first type.
 */
export declare type Overwrite<T1, T2> = {
    [P in Exclude<keyof T1, keyof T2>]: T1[P];
} & T2;
/**
 * Takes a type and filter them, leaving only types that have a given property of a given type.
 *
 * ```typescript
 * interface Square {
 *   kind: "square",
 *   geometry: {
 *     side: number;
 *   }
 * }
 *
 * interface Circle {
 *   kind: "circle",
 *   geometry: {
 *     radius: number;
 *   }
 * }
 *
 * interface Rectangle {
 *   kind: "rectangle",
 *   geometry: {
 *     horizontalSide: number;
 *     verticalSide: number;
 *   }
 * }
 *
 * interface Ellipsis {
 *   kind: "ellipsis",
 *   geometry: {
 *     horizontalHalfAxis: number;
 *     verticalHalfAxis: number;
 *    }
 * }
 *
 * // Union of all shapes
 * type Shape = Square | Circle | Rectangle | Ellipsis;
 *
 * // Select a particular shape when given its kind
 * type ellipsis = DiscriminateUnion<Shape, "kind", "ellipsis">;
 * ```
 * @typeparam T Type to filter.
 * @typeparam K Property name by which to filter.
 * @typeparam V Type which the property must have.
 */
export declare type DiscriminateUnion<T, K extends keyof T, V extends T[K] = T[K]> = T extends Record<K, V> ? T : never;
/**
 * Given a discriminated (tagged) union, creates a map between the tag (discriminant) and the corresponding type.
 *
 * ```typescript
 * interface Square {
 *   kind: "square",
 *   geometry: {
 *     side: number;
 *   }
 * }
 *
 * interface Circle {
 *   kind: "circle",
 *   geometry: {
 *     radius: number;
 *   }
 * }
 *
 * interface Rectangle {
 *   kind: "rectangle",
 *   geometry: {
 *     horizontalSide: number;
 *     verticalSide: number;
 *   }
 * }
 *
 * interface Ellipsis {
 *   kind: "ellipsis",
 *   geometry: {
 *     horizontalHalfAxis: number;
 *     verticalHalfAxis: number;
 *    }
 * }
 *
 * // Union of all shapes
 * type Shape = Square | Circle | Rectangle | Ellipsis;
 *
 * // Resolves to {square: Square, circle: Circle, rectangle: Rectangle, ellipsis: Ellipsis}
 * type kindToShape = UnionMap<Shape, "kind">;
 * ```
 *
 * @typeparam T Union type.
 * @typeparam K Name of the property that is the tag (discriminant) for the union
 */
export declare type UnionMap<T extends Record<K, string>, K extends keyof T> = {
    [P in T[K]]: DiscriminateUnion<T, K, P>;
};
/**
 * A runnable is a function performs some operation when it is called, possibly
 * with side effects, but does not return any value.
 *
 * ```typescript
 * function runTest(test: Runnable) {
 *   const t1 = Date.now();
 *   try {
 *     test();
 *     console.log("Test successful");
 *   }
 *   catch(e) {
 *     console.log("Test failed.");
 *   }
 *   finally {
 *     const t2 = Date.now();
 *     console.log(`Took ${(b-a)/1000} s`);
 *   }
 * }
 *
 * runTest( () => JSON.parse(inputData) );
 * ```
 */
export declare type Runnable = () => void;
/**
 * A function that takes a single argument and returns a value.
 *
 * ```typescript
 * const stringLength;
 * ["foo", "bar", "foobar"].map(stringLength);
 * ```
 *
 * @typeparam T Type of the function's argument.
 * @typeparam R Type of the function's return value.
 */
export declare type TypedFunction<TParam, TReturn = TParam> = (arg: TParam) => TReturn;
/**
 * Same as TypedFunction, but takes two arguments.
 * @see {@link TypedFunction}
 */
export declare type TypedBiFunction<TParam1, TParam2 = TParam1, TReturn = TParam1> = (arg1: TParam1, arg2: TParam2) => TReturn;
/**
 * Same as TypedFunction, but takes three arguments.
 * @see {@link TypedFunction}
 */
export declare type TypedTriFunction<TParam1, TParam2 = TParam1, TParam3 = TParam2, TReturn = TParam3> = (arg1: TParam1, arg2: TParam2, arg3: TParam3) => TReturn;
/**
 * Interface for a reversible function.
 *
 * ```typescript
 * const linearFunction: ReversibleFunction<number> = {
 *   forward: x => 2 * x + 3,
 *   backward: y => 0.5 * (y - 3);
 * }
 * ```
 * linearFunction.forward(1); // => 5
 * linearFunction.backward(5); // => 1
 * linearFunction.backward(linearFunction.forward(Math.PI)); // => 3.141...
 * linearFunction.forward(linearFunction.backward(Math.PI)); // => 3.141...
 * ```
 *
 * @typeparam TParam Type of the function argument.
 * @typeparam TParam Type of the function return value.
 */
export interface ReversibleFunction<TParam, TReturn = TParam> {
    forward(param: TParam): TReturn;
    backward(param: TReturn): TParam;
}
/**
 * Interface for a reversible function.
 *
 * ```typescript
 * class Vector2 {
 *   constructor(public x: number, public y: number);
 * }
 *
 * const field: ReversibleBiFunction<number, Vector2> = {
 *   forward: (x, y) => new Vector2(2*x , 2*y),
 *   backward: r => [0.5 * r.x, 0.5 * r.y],
 * }
 *
 * const r = field.forward(2, 1); // => Vector2(4, 2)
 * field.backward(r); // => [2, 1]
 * ```
 *
 * @typeparam TParam1 Type of the first function argument.
 * @typeparam TParam2 Type of the second function argument.
 * @typeparam TParam Type of the function return value.
 */
export interface ReversibleBiFunction<TParam1, TParam2 = TParam1, TReturn = TParam2> {
    forward(param1: TParam1, param2: TParam2): TReturn;
    backward(param: TReturn): Pair<TParam1, TParam2>;
}
/**
 * Interface for a reversible function.
 *
 * ```typescript
 * class Vector3 {
 *   constructor(public x: number, public y: number, public z: number);
 * }
 *
 * const field: ReversibleTriFunction<number, Vector3> = {
 *   forward: (x, y, z) => new Vector3(2*x , 2*y, 2*z),
 *   backward: r => [0.5 * r.x, 0.5 * r.y, 0.5 * r.z],
 * }
 *
 * const r = field.forward(2, 1, 4); // => Vector3(4, 2, 8)
 * field.backward(r); // => [2, 1, 4]
 * ```
 *
 * @typeparam TParam1 Type of the first function argument.
 * @typeparam TParam2 Type of the second function argument.
 * @typeparam TParam3 Type of the third function argument.
 * @typeparam TParam Type of the function return value.
 */
export interface ReversibleTriFunction<TParam1, TParam2 = TParam1, TParam3 = TParam2, TReturn = TParam3> {
    forward(param1: TParam1, param2: TParam2, param3: TParam3): TReturn;
    backward(param: TReturn): Triple<TParam1, TParam2, TParam3>;
}
/**
 * A supplier produces a value without an explicit input.
 *
 * ```typescript
 * // A logging function for messages that may be costly to produce, eg. that
 * // may involve serialzing a deep object graph for debugging purposes. A
 * // supplier can be used to create the logging message only when the logging
 * // level is set to debug.
 * function debug(messageSupplier: Supplier<string>): void {
 *   if (loggingLevel === "debug") {
 *     console.debug(messageSupplier());
 *   }
 * }
 *
 * ```
 *
 * @typeparam T Type of the produced value.
 */
export declare type Supplier<T> = () => T;
/**
 * Same as a Supplier, but returns two items.
 * @see {@link Supplier}
 */
export declare type BiSupplier<T1, T2 = T1> = () => Pair<T1, T2>;
/**
 * Same as a Supplier, but returns three items.
 * @see {@link Supplier}
 */
export declare type TriSupplier<T1, T2 = T1, T3 = T2> = () => Triple<T1, T2, T3>;
/**
 * A consumer is a sink that takes an item and performs some action with it, but
 * does not return anything.
 *
 * ```typescript
 * function getViaAjax(endpoint: string, onDone: Consumer<object>) {
 *   fetch(endpoint)
 *      .then(response => JSON.parse(readBody(response)));
 *      .catch(e => console.error("Could not fetch data", e));
 * }
 * ```
 *
 * @typeparam T Type of the item that is consumed.
 */
export declare type Consumer<T> = (item: T) => void;
/**
 * Same as Consumer, but accepts two items to be consumed.
 * @see {@link Consumer}
 */
export declare type BiConsumer<T1, T2 = T1> = (item1: T1, item2: T2) => void;
/**
 * Same as Consumer, but accepts three items to be consumed.
 * @see {@link Consumer}
 */
export declare type TriConsumer<T1, T2 = T1, T3 = T1> = (item1: T1, item2: T2, item3: T3) => void;
/**
 * An operator takes an item of a given type and computes a result of the
 * same type.
 *
 * ```typescript
 * const negate: UnaryOperator<number> = x => -x;
 * [1,2,3,4,5].map(negate);
 * ```
 *
 * @typeparam Type of the domain on which the operator operates.
 */
export declare type UnaryOperator<T> = TypedFunction<T, T>;
/**
 * A binary operator takes two items of the same type and coputes a result of
 * the same type.
 *
 * ```typescript
 * const multiply: BinaryOperator<number> = (x, y) => x * y;
 * [1,2,3,4,5].reduce(multiply, 1); // => 120
 * ```
 *
 * @typeparam Type of the domain on which the operator operates.
 */
export declare type BinaryOperator<T> = TypedBiFunction<T, T, T>;
/**
 * A predicate that takes an items and check for a condition.
 *
 * ```javascript
 * const isOdd : Predicate<number> = x => x % 2 === 1;
 * [1,2,3,4,5,6,7,8,9].filter(isOdd) // => [1,3,5,7,9]
 * ```
 *
 * @typeparam T Type of the item to test.
 * @param item Item to test.
 * @return The result of the test.
 */
export declare type Predicate<T> = (item: T) => boolean;
/**
 * Same as Predicate, but accepts two parameters.
 */
export declare type BiPredicate<T1, T2 = T1> = (item1: T1, item2: T2) => boolean;
/**
 * Same as Predicate, but accepts three parameters.
 */
export declare type TriPredicate<T1, T2 = T1, T3 = T2> = (item1: T1, item2: T2, item3: T3) => boolean;
/**
 * An equator that takes to items and checks whether they are
 * equal to each other.
 *
 * ```javascript
 * const sameLength : Equator<string> = (lhs, rhs) => lhs.length === rhs.length;
 * ["a", "aa", "aaa"].find(sameLength.bind(null, "me"))
 * ```
 * @typeparam T Type of the objects to compare.
 * @param lhs The first (left-hand side) item to compare.
 * @param rhs The second (right-hand side) item to compare.
 * @return True iff both items are deemed equal.
 */
export declare type Equator<T> = (lhs: T, rhs: T) => boolean;
/**
 * A comparator that takes two objects and compares them. Returns a negative or
 * positive number to indicate the first object is less or greater than the
 * second object; or `0` iff both objects are equal.
 *
 * ```javascript
 * const myComparator = (lhs, rhs) => rhs - lhs;
 * [3, 1, 2].sort(myComparator);
 * // => [3, 2, 1]
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @param lhs The first (left-hand side) object to compare.
 * @param rhs The second (right-hand side) object to compare.
 * @return A negative number iff lhs is strictly smaller than rhs, a positive
 * number iff lhs is strictly greater than rhs; or `0` otherwise, when both
 * objects are equal.
 */
export declare type Comparator<T> = (lhs: T, rhs: T) => number;
/**
 * Extracts a key from an object used for comparing the object to other objects.
 *
 * ```javascript
 * class Customer {
 *   constructor(public id: number, public name: string) {}
 *
 *   static keyId(customer: Customer): number {
 *     return customer.id;
 *   }
 *
 *   static keyName(customer: Customer): string {
 *     return customer.name;
 *   }
 * }
 *
 * const collection = new IndexedCollection<Customer>();
 * const byId = collection.createOrderedIndex<number>({key: Customer.byId});
 * const byName = collection.createOrderedIndex<string>({key: Customer.byName});
 * // add some customers
 * // ...
 * byId.getAt(9);
 * byName.getAt("Cleopatra");
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @typeparam K The type of the extracted key.
 * @param object Object to extract a key from.
 * @return The key for the object.
 */
export declare type KeyExtractor<T, K> = (item: T) => K;
/** A 1-tuple with one element. */
export declare type Single<T1> = [T1];
/** A 2-tuple with two elements. */
export declare type Pair<T1, T2 = T1> = [T1, T2];
/** A 3-tuple with three elements. */
export declare type Triple<T1, T2 = T1, T3 = T2> = [T1, T2, T3];
/** A 4-tuple with four elements. */
export declare type Quadruple<T1, T2 = T1, T3 = T2, T4 = T3> = [T1, T2, T3, T4];
/** A 5-tuple with five elements. */
export declare type Quintuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4> = [T1, T2, T3, T4, T5];
/** A 6-tuple with six elements. */
export declare type Sextuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5> = [T1, T2, T3, T4, T5, T6];
/** A 7-tuple with seven elements. */
export declare type Septuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5, T7 = T6> = [T1, T2, T3, T4, T5, T6, T7];
/** An 8-tuple with eight elements. */
export declare type Octuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5, T7 = T6, T8 = T7> = [T1, T2, T3, T4, T5, T6, T7, T8];
/** A 9-tuple with nine elements. */
export declare type Nonuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5, T7 = T6, T8 = T7, T9 = T8> = [T1, T2, T3, T4, T5, T6, T7, T8, T9];
/** A 10-tuple with ten elements. */
export declare type Decuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5, T7 = T6, T8 = T7, T9 = T8, T10 = T9> = [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10];
/**
 * A key-value pair as an array tuple. Used eg. by Map#entries.
 *
 * ```typescript
 * const Map<number, User> users = new Map();
 * const entries: Iterable<KeyValuePair<number, User>> = users.entries();
 * ```
 *
 * @typeparam K Type of the key.
 * @typeparam V Type of the value.
 */
export declare type KeyValuePair<K, V> = Pair<K, V>;
/**
 * A key-value pair as an object with the named properties `key` and `value`.
 * @typeparam K Type of the key.
 * @typeparam V Type of the value.
 */
export interface KeyValueEntry<K, V> {
    key: K;
    value: V;
}
/**
 * Similar to typescripts built-in type `Record`,
 * but with the order of type parameters reverse
 * and the keys being optional.
 *
 * An object with string keys and a given value type.
 * Optionally, you can limit the available keys to a
 * set of given keys.
 *
 * ```typescript
 * const obj: StringObject<boolean> = {
 *   foo: true,
 *   bar: false,
 *   foobar: false,
 * };
 *
 * const obj2: StringObject<boolean, "foo" | "bar"> = {
 *   foo: true,
 *   bar: false,
 *   // Object literal may only specify known properties, and 'foobar'
 *   // does not exist in type 'StringObject<boolean, "foo" | "bar">'.
 *   foobar: false
 * };
 * ```
 *
 * @typeparam T Type of the values in the object.
 * @typeparam K Type of the available keys in the string object.
 */
export declare type StringObject<T, K extends keyof any = string> = {
    [P in K]: T;
};
/**
 * An object with number keys and a given value type.
 *
 * ```typescript
 * const obj: NumberObject<boolean> = {
 *   4: true,
 *   2: false,
 * };
 *
 * ```
 * @typeparam T Type of the values in the object.
 */
export interface NumberObject<T> {
    [key: number]: T;
}
/**
 * An interface for comparable objects of the same type.
 * They are compared via a special method 'compareTo'.
 * @typeparam T Type of the objects to compare.
 *
 * ```typescript
 * class Vector implements Comparable<Vector> {
 *   constructor(private x: number, private y: number) {}
 *   add(vector: Vector) : Vector {
 *     return new Vector(this.x + vector.x, this.y + vectory.y)
 *   }
 *   get abs2() : number {
 *     return this.x*this.x + this.y*this.y;
 *   }
 *   get abs() : number {
 *     return Math.sqrt(this.x*this.x + this.y*this.y);
 *   }
 *   compareTo(vector: Vector) : number {
 *     return this.abs2 - vector.abs2;
 *   }
 *   static get compare() : Comparator<Vector> {
 *     return byProp("abs2")
 *   }
 * }
 *
 * [new Vector(2,3), new Vector(1,2)].sort(Vector.compare);
 * ```
 *
 * @typeparam T Type of the items that are compared.
 */
export interface Comparable<T> {
    compareTo(rhs: T): number;
}
/**
 * An interface for equatable objects of the same type.
 * They are checked for equality via a special method `equals`.
 * @typeparam T Type of the objects to compare.
 *
 * ```
 * class Entity implements Equatable<Entity> {
 *   private id: number;
 *   private name: string;
 *   private mail: string;
 *
 *   constructor(id: number, name: string, mail: string) {
 *     this.id = id;
 *     this.name = name;
 *     this.mail = mail;
 *   }
 *
 *   equals(rhs: Entity) {
 *     return rhs !== undefined && this.id === rhs.id;
 *   }
 * }
 * const user = DatabaseAPI.getById(1);
 *
 * // ... some code
 *
 * // This creates a new user instance
 * const sameUser = DatabaseAPI.getById(1);
 *
 * user === sameUser; // => false
 * user.equals(sameUser) // => true
 * ```
 */
export interface Equatable<T> {
    equals(rhs: T): boolean;
}
/**
 * An iterator that deletes the item when the `next` method is passed true.
 * Often used with collections when iterating over their items.
 *
 * ```typescript
 * // Create a new collection, add some numbers, iterate over them, delete
 * // those numbers that are odd.
 * collection = build<number>("hashedUnique");
 * collection.addAll[1,2,3,4,5,6,7,8,9,10]);
 * for (let it = collection.values(), result = it.next(), remove = false; !result.done; result = it.next(remove)) {
 *   console.log("Processing item", result.value);
 *   remove = result.value % 2 === 1;
 * }
 * ```
 *
 * @typeparam T Type of the items over which the iteration is performed.
 */
export interface DeletableIterator<T> extends Iterator<T> {
    next(remove?: boolean): IteratorResult<T>;
}
/**
 * An iterable that provides a DeletableIterator.
 * @see {@link DeletableIterator}
 */
export interface DeletableIterable<T> extends Iterable<T> {
    [Symbol.iterator](): DeletableIterator<T>;
}
/**
 * An DeletableIterator that is also iterable.
 * @see {@link DeletableIterator}
 * @see {@link DeletableIterable}
 */
export interface DeletableIterableIterator<T> extends IterableIterator<T>, DeletableIterator<T> {
    next(remove?: boolean): IteratorResult<T>;
    [Symbol.iterator](): DeletableIterableIterator<T>;
}
/**
 * A collector takes all items of a stream and incorporates them
 * into a single object. It does this by first creating an intermediate
 * container (eg. a Set), then processing all items (eg. adding them
 * to the Set), and finally converting the intermediate value to the
 * resulting value (eg. the size of the set).
 *
 * ```typescript
 * function toSetT>(): Collector<T, any, Set<T>> {
 *   accumulator(intermediate: T[], item: T) {
 *     intermediate.push(item);
 *   },
 *   supplier(): T[] {
 *     return [];
 *   },
 *   finisher(intermediate: T[]): Set<T> {
 *     return new Set(intermediate);
 *   },
 * };
 *
 * stream([1,2,3]).map(x => 2*x).collect(toSet());
 * ```
 *
 * @typeparam S Type of the items to be collected.
 * @typeparam T Type of the intermediate object used while collecting.
 * @typeparam R Type of the collected object.
 */
export interface Collector<S, T, R> {
    /**
     * Takes the intermediate object and the current object; and
     * incorporates the current object into the intermediate object.
     */
    accumulator: BiConsumer<T, S>;
    /**
     * Creates a new intermediate object.
     */
    supplier: Supplier<T>;
    /**
     * Transform the intermediate object into the final result.
     */
    finisher: TypedFunction<T, R>;
}
/**
 * A rectangular area, specified by the top-left and bottom-right
 * corner; or its top-right and bottom-left corner.
 */
export interface MinMaxRectangle {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
/**
 * The position and size of a rectangular area, with a position,
 * a width, and a height. The position is a reference point on
 * the rectangle, ie. the top-left corner or the center point.
 */
export interface Rectangle extends Vector2, RectSize {
}
/** A circle with a given radius. The position is relative to a point of your definition. */
export interface Circle extends Vector2 {
    radius: number;
}
/**
 * The size of a rectangular area with a width and height.
 */
export interface RectSize {
    height: number;
    width: number;
}
/**
 * A one-dimensional vector with an x coordinate.
 */
export interface Vector1 {
    /** The x-coordinate of this vector. */
    x: number;
}
/**
 * A two-dimensional vector with an x and y coordinate.
 */
export interface Vector2 {
    /** The x-coordinate of this vector. */
    x: number;
    /** The y-coordinate of this vector. */
    y: number;
}
/**
 * A three-dimensional vector with an x, y and z coordinate.
 */
export interface Vector3 {
    /** The x-coordinate of this vector. */
    x: number;
    /** The y-coordinate of this vector. */
    y: number;
    /** The z-coordinate of this vector. */
    z: number;
}
/**
 * A four-dimensional vector with four coordinates.
 */
export interface Vector4 {
    /** The first coordinate of this vector. */
    x1: number;
    /** The second coordinate of this vector. */
    x2: number;
    /** The third coordinate of this vector. */
    x3: number;
    /** The fourth coordinate of this vector. */
    x4: number;
}
/**
 * A five-dimensional vector with four coordinates.
 */
export interface Vector5 {
    /** The first coordinate of this vector. */
    x1: number;
    /** The second coordinate of this vector. */
    x2: number;
    /** The third coordinate of this vector. */
    x3: number;
    /** The fourth coordinate of this vector. */
    x4: number;
    /** The fifth coordinate of this vector. */
    x5: number;
}
/** List of the four cardinal directions. */
export declare type CardinalDirection4 = "North" | "East" | "South" | "West";
/** List of the eight cardinal directions. */
export declare type CardinalDirection8 = CardinalDirection4 | "Northeast" | "Southeast" | "Southwest" | "Northwest";
/** List of the sixteen cardinal directions. */
export declare type CardinalDirection16 = CardinalDirection8 | "NorthNortheast" | "EastNortheast" | "EastSoutheast" | "SouthSoutheast" | "SouthSouthwest" | "WestSouthwest" | "WestNorthwest" | "NorthNorthwest";
/** List of the thirty-two cardinal directions. */
export declare type CardinalDirection32 = CardinalDirection16 | "NorthByEast" | "NortheastByNorth" | "NortheastByEast" | "EastByNorth" | "EastBySouth" | "SoutheastByEast" | "SoutheastBySouth" | "SouthByEast" | "SouthByWest" | "SouthwestBySouth" | "SouthwestByWest" | "WestBySouth" | "WestByNorth" | "NorthwestByWest" | "NorthwestByNorth" | "NorthByWest";
