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


See the [documentation](https://blutorange.github.io/js-andross/) for a list of all interfaces and types with a short description.

# Changes

- 0.3.0 Added Vector types (`Vector1`, `Vector2`, `Vector3`, `Vector4`, `Vector5`) as well as `Omit` and `Overwrite`
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
