/**
 * Represents an optional values. Absence of the value is indicated
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
export type Maybe<T> = T | undefined;

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
export type Constructor<T = {}> = new (...args: any[]) => T;

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
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

// Interfaces representing special types of functions. These are often used
// in functional programming.

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
export type Runnable = () => void;

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
export type TypedFunction<T, R> = (arg: T)  => R;

/**
 * Same as TypedFunction, but takes two arguments.
 * @see {@linked TypedFunction}
 */
export type TypedBiFunction<T, S, R> = (arg1: T, arg2: S)  => R;

/**
 * Same as TypedFunction, but takes three arguments.
 * @see {@linked TypedFunction}
 */
export type TypedTriFunction<T, S, U, R> = (arg1: T, arg2: S, arg3: U)  => R;

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
export type Supplier<T> = () => T;

/**
 * Same as a Supplier, but returns two items.
 * @see {@link Supplier}
 */
export type BiSupplier<T, S> = () => Pair<T, S>;

/**
 * Same as a Supplier, but returns three items.
 * @see {@link Supplier}
 */
export type TriSupplier<T, S, U> = () => Triple<T, S, U>;

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
export type Consumer<T> = (item: T)  => void;

/**
 * Same as Consumer, but accepts two items to be consumed.
 * @see {@link Consumer}
 */
export type BiConsumer<T, S> = (item1: T, item2: S)  => void;

/**
 * Same as Consumer, but accepts three items to be consumed.
 * @see {@link Consumer}
 */
export type TriConsumer<T, S, U> = (item1: T, item2: S, item3: U)  => void;

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
export type UnaryOperator<T> = TypedFunction<T, T>;

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
export type BinaryOperator<T> = TypedBiFunction<T, T, T>;

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
export type Predicate<T> = (item: T) => boolean;

/**
 * Same as Predicate, but accepts two parameters.
 */
export type BiPredicate<T, S> = (item1: T, item2: S) => boolean;

/**
 * Same as Predicate, but accepts three parameters.
 */
export type TriPredicate<T, S, U> = (item1: T, item2: S, item3: U) => boolean;

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
export type Equator<T> = (lhs: T, rhs: T) => boolean;

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
export type Comparator<T> = (lhs: T, rhs: T) => number;

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
export type KeyExtractor<T, K> = (item: T) => K;

// Tuple and collection types.

/** A 1-tuple with one element. */
export type Single<T1> = [T1];
/** A 2-tuple with two elements. */
export type Pair<T1, T2> = [T1, T2];
/** A 3-tuple with three elements. */
export type Triple<T1, T2, T3> = [T1, T2, T3];
/** A 4-tuple with four elements. */
export type Quadruple<T1, T2, T3, T4> = [T1, T2, T3, T4];
/** A 5-tuple with five elements. */
export type Quintuple<T1, T2, T3, T4, T5> = [T1, T2, T3, T4, T5];
/** A 6-tuple with six elements. */
export type Sextuple<T1, T2, T3, T4, T5, T6> = [T1, T2, T3, T4, T5, T6];
/** A 7-tuple with seven elements. */
export type Septuple<T1, T2, T3, T4, T5, T6, T7> = [T1, T2, T3, T4, T5, T6, T7];
/** An 8-tuple with eight elements. */
export type Octuple<T1, T2, T3, T4, T5, T6, T7, T8> = [T1, T2, T3, T4, T5, T6, T7, T8];
/** A 9-tuple with nine elements. */
export type Nonuple<T1, T2, T3, T4, T5, T6, T7, T8, T9> = [T1, T2, T3, T4, T5, T6, T7, T8, T9];
/** A 10-tuple with ten elements. */
export type Decuple<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10];

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
export type KeyValuePair<K, V> = Pair<K, V>;

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

// Iterators

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
