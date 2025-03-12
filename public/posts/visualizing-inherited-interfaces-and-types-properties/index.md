---
title: Visualizing Inherited Interfaces and Types Properties
description: Discover how to reveal the properties of deeply nested types and interfaces. Simple approach.
date: 2023-02-12
tags: [TypeScript, utility-types, interfaces, types, inheritance]
image: chris-lawton-50.jpg
photoBy: Chris Lawton
---

Working on a bigger project, it's common to have multiple interfaces, where one interface extends from another, the next one extends from the previous one, and so on. Moreover, those interfaces can be located in different files or folders. This approach does its job, but sometimes you may want to view all the properties in the interface, including the inherited ones (same for types, but we will talk about them later). Look at the code below:

```tsx
interface Animal {
  class: string;
  isCarnivore: boolean;
  isViviparous: boolean;
  isVertebrate: boolean;
  habitat: string;
  age: number;
}

export interface Reptile extends Animal {
  class: 'reptile';
  species: 'snake' | 'lizard' | 'crocodile' | 'turtle';
  hasLegs: boolean;
  canSwim: boolean;
}
```

```tsx
import { Reptile } from './interfaces/Reptile';

export interface Turtle extends Reptile {
  species: 'turtle';
  isCarnivore: false;
  isVertebrate: true;
  hasLegs: true;
  canSwim: true;
  name: string;
}
```

```tsx
import { Turtle } from './interfaces/Turtle';

interface Archelon extends Turtle {}
```

I would like to view the properties of Archelon, but all I can see is `interface Archelon`. Why is that? Well, interfaces in TypeScript are purely a compile-time construct and do not have any runtime representation. You can use a type that will display all the properties of the object. Unfortunately, doing this `type Archelon = Turtle` will not help. So, we definitely need a type that will extract all the properties. And here is where Utility Types come in. According to the [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/utility-types.html), they _facilitate common type transformations_. Exactly what we need! You just have to choose an appropriate utility type. We can pick all the properties or omit none of them.

## Let's start with the first idea:

How can we pick up all the properties of the `Turtle` interface? The `keyof` operator is used to extract the keys of an object type, so it will help us to do that.

```tsx {26}
interface Animal {
  class: string;
  isCarnivore: boolean;
  isViviparous: boolean;
  isVertebrate: boolean;
  habitat: string;
  age: number;
}

interface Reptile extends Animal {
  class: 'reptile';
  species: 'snake' | 'lizard' | 'crocodile' | 'turtle';
  hasLegs: boolean;
  canSwim: boolean;
}

interface Turtle extends Reptile {
  species: 'turtle';
  isCarnivore: false;
  isVertebrate: true;
  hasLegs: true;
  canSwim: true;
  name: string;
}

type Archelon = Pick<Turtle, keyof Turtle>;
```

Works as expected.

![Correct type](./correct-type.gif 'Correct type')

## Now let's try the second approach.

The `Omit` utility type receives a `string`, `number` or `symbol` as the second type. And do the opposite to `Pick`. All the keys of the object are strings only. So, if we use something different from the string, we will get all the properties in the interface. Let's take the `symbol`:

```tsx {10}
interface Turtle extends Reptile {
  species: 'turtle';
  isCarnivore: false;
  isVertebrate: true;
  hasLegs: true;
  canSwim: true;
  name: string;
}

type Archelon = Omit<Turtle, symbol>;
```

Works the same and seems to be more clean. However, numbers can be found in arrays when numbers and symbols are in structures like `Map`. So, I'd not recommend using this approach. Take the first one.
You can think: «Hm... But what if we just use types everywhere? Maybe then we can avoid using `Pick` at all?» Well, let's try:

```tsx
type Animal = {
  class: string;
  isCarnivore: boolean;
  isViviparous: boolean;
  isVertebrate: boolean;
  habitat: string;
  age: number;
};

type Reptile = Animal & {
  class: 'reptile';
  species: 'snake' | 'lizard' | 'crocodile' | 'turtle';
  hasLegs: boolean;
  canSwim: boolean;
};

type Turtle = Reptile & {
  species: 'turtle';
  isCarnivore: false;
  isVertebrate: true;
  hasLegs: true;
  canSwim: true;
  name: string;
};

type Archelon = Turtle;
```

Yes, this behaves differently from the approach based on interfaces, but it still does not satisfy the requirements of displaying all properties.

![Archelon](./Archelon-type.gif 'Archelon type')

You can do exactly the same as I did above with interfaces (first approach using `Pick`).
