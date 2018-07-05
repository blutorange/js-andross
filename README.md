Common interfaces and types for typescript, such `Predicate` or `Maybe`. This is of no use if you do not use typescript.
I made this because I often ended up needing and writing the same types for my projects.

# Documentation
[Documentation and list of all the interfaces and types.](https://blutorange.github.io/js-andross/)

# Install

The drill:

```sh
npm install --save andross
```

Now you can import the types 

# Usage

All available and types are exposed from the main file.

```typescript
// import this lib
import { Predicate, Maybe, Comparator } from "andross";

// Use the interfaces and type.
class Users<T> {
  private users: Users[];
  constructor() {
    this.users = [];    
  }
  getUserById(id: number): Maybe<User> {
    return this.users.find(user => user.id === id);
  }
  getUsers(filter: Predicate<User>): User[] {
    return this.users.filter(filter);
  }
  sort(comparator: Comparator<T>) {
    this.users.sort(comparator);
  }
}
```

# Enums

As of version 0.3.4, this package also includes some predefined enumerations. Since these are not purely type definitions and contribute to
the size of a bundle, they are placed in a separate file and not included in the main file:

```typescript
import { CardinalDirection4 } from "andross/enum";
const north = CardinalDirection4.North;
```

See the [documentation](https://blutorange.github.io/js-andross/) for a list of all interfaces and types with a short description.

# Changes

- 0.3.5 Added an optional type parameter `K` to `StringObject`, allowing you to restrict the available keys. Also removed the `*.ts` source files from the NPM package. The source file made webpack with `ts-loader` work incorrectly.
- 0.3.4 Added types `RectSize`, `Rectangle`, `MinMaxRectangle`, `CardinalDirection4/8/16/32`, `ReadonlyFor`, `ReadonlyExcept`, `MatchingKeys`.
- 0.3.3 Added types `PartialExcept` (makes every property but the given optional) and `PartialFor` (makes every given property optional).
- 0.3.2 Added `RemoveFrom`. Tuple types generics now default to the previous type, ie. `Pair<string>` is equivalent to `Pair<string, string>`.
- 0.3.1 Added `Builder` type.
- 0.3.0 Added Vector types (`Vector1`, `Vector2`, `Vector3`, `Vector4`, `Vector5`), `StringObject` and `NumberObject`, as well as `Omit` and `Overwrite`
- 0.2.0 Added JSON types.

# Build

May not work on Windows.

```sh
git clone https://github.com/blutorange/js-andross
cd js-andross
npm install
npm run build
```

# Teh name

The great (inter-)face of [Andross](http://starfox.wikia.com/wiki/Andross).
