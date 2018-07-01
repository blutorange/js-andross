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
/**
 * Gives all property keys whose types match the given type.
 *
 * ```typescript
 * export interface User {
 *   active: boolean;
 *   age: number;
 *   mail: string;
 *   name: string;
 *   username: string;
 * }
 *
 * export function foo(stringKey: MatchingKeys<User, string>) {
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
 * @typeparam K Type whose keys are considered in the output. Defaults to the keys of the record.
 */
export declare type MatchingKeys<TRecord, TMatch, K extends keyof TRecord = keyof TRecord> = K extends (TRecord[K] extends TMatch ? K : never) ? K : never;
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
export declare type TypedFunction<T, R> = (arg: T) => R;
/**
 * Same as TypedFunction, but takes two arguments.
 * @see {@link TypedFunction}
 */
export declare type TypedBiFunction<T, S, R> = (arg1: T, arg2: S) => R;
/**
 * Same as TypedFunction, but takes three arguments.
 * @see {@link TypedFunction}
 */
export declare type TypedTriFunction<T, S, U, R> = (arg1: T, arg2: S, arg3: U) => R;
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
export declare type BiSupplier<T, S> = () => Pair<T, S>;
/**
 * Same as a Supplier, but returns three items.
 * @see {@link Supplier}
 */
export declare type TriSupplier<T, S, U> = () => Triple<T, S, U>;
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
export declare type BiConsumer<T, S> = (item1: T, item2: S) => void;
/**
 * Same as Consumer, but accepts three items to be consumed.
 * @see {@link Consumer}
 */
export declare type TriConsumer<T, S, U> = (item1: T, item2: S, item3: U) => void;
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
export declare type BiPredicate<T, S> = (item1: T, item2: S) => boolean;
/**
 * Same as Predicate, but accepts three parameters.
 */
export declare type TriPredicate<T, S, U> = (item1: T, item2: S, item3: U) => boolean;
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
 * An object with string keys and a given value type.
 *
 * ```typescript
 * const obj: StringObject<boolean> = {
 *   foo: true,
 *   bar: false,
 * };
 * ```
 *
 * @typeparam T Type of the values in the object.
 */
export interface StringObject<T> {
    [key: string]: T;
}
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
