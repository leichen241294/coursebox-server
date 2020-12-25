# Decorator trong TypeScript

## Decorator là gì?

### Khái niệm

Decorator là feature cải tiến của TypeScript phục vụ lập trình Metaprogramming[1], áp dụng lên class, method, properties, accessor, parameter.

TypeScript không hỗ trợ built-in decorator: nếu bạn muốn sử dụng nó, bạn phải hoặc là cài đặt hoặc import thư viện (ví dụ từ NPM).

### Cú pháp

Để hiểu cách decorator hoạt động, tham khảo ví dụ:

```ts
@serialize
class CourseController(){
    getAllCourses(): Course[]{
        ...
    }
}
```

`serialize` là một decorator, đứng sau flag `@`. Nếu không sử dụng decorator, bạn có thể code theo kiểu truyền thống:

```ts
let CourseController = serialize(
    class CourseController(){
        getAllCourses(): Course[]{
        ...
        }
    }
)
```
### Các kiểu decorator
Official documentation thể hiện 5 kiểu decorator, gồm: class, method, properties, accessor và parameter decorator. 
Cần tuân theo type signature[2] của từng kiểu khi cài đặt decorator.

Kiểu | Type signature
-----|---------------
Class decorator | `(Constructor: {new(...any[]) => any}) => any`
Method decorator | `(classPrototype: {}, methodName: string, descriptor: PropertyDescriptor ) => any`
Properties decorator | `(classPrototype: {}, propertyName: string) => any`
Accessor decorator | `(classPrototype: any, accessorName: string, descriptor: PropertyDescriptor ) => any`
Parameter decorator |  `(classPrototype: {}, paramName: string, index: number) => void`


#### Class decorator
```ts
function changeAmount<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    amount = 3;
  };
}

@changeAmount
class CourseController {
  amount = 2;

  getAllCourses(): string {
    return 'Course';
  }
}

const courseController = new CourseController();
console.log('amount', courseController.amount);  // amount 3

```
#### Method decorator
```ts
function mistransmit() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = function () {
      const result = 'I says somethings different';
      return result;
    };

    return descriptor;
  };
}

class Person {
  public name: string;
  public surname: string;

  constructor(name: string, surname: string) {
    this.name = name;
    this.surname = surname;
  }

  @mistransmit()
  public saySomething(something: string, somethingElse: string): string {
    return (
      this.name +
      ' ' +
      this.surname +
      ' says: ' +
      something +
      ' ' +
      somethingElse
    );
  }
}

var p = new Person('remo', 'jansen');
const says = p.saySomething('I love playing', 'halo');
console.log(says); // I says somethings different
```
#### Properties decorator
```ts
import 'reflect-metadata';

const formatMetadataKey = Symbol('format');

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

class Greeter {
  @format('Hello, %s') // store metadata
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    let formatString = getFormat(this, 'greeting'); // call function to retrive metadata
    return formatString.replace('%s', this.greeting); // string processed
  }
}

function getFormat(target: any, propertyKey: string) {
  const result = Reflect.getMetadata(formatMetadataKey, target, propertyKey);
  return result;
}

const greeter = new Greeter('Khánh');
console.log(greeter.greet()); // Hello, Khánh
```
#### Accessor decorator
```ts
function toInt() {
  return function (
    target: any,
    accessorName: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.get = function () {
      return 'Hello';
    };
    return descriptor;
  };
}

class Point {
  private _x: number;
  private y: number;
  constructor(_x: number, _y: number) {
    this._x = _x;
    this.y = _y;
  }

  @toInt()
  get x(): number {
    return this._x;
  }
}

const A = new Point(2, 0);
console.log('A.x', A.x) // A.x Hello
```
#### Parameter decorator
```ts
import 'reflect-metadata';
const metadataKey = Symbol('required');

class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  @validate
  greet(@required name: string) {
    return 'Hello ' + name + ', ' + this.greeting;
  }
}

function required(target: {}, paramName: string, index: number) {
  const existingRequires: number[] =
    Reflect.getOwnMetadata(metadataKey, target) || [];
  existingRequires.push(index);

  Reflect.defineMetadata(metadataKey, existingRequires, target);
}

function validate(
  classPrototype: {},
  methodName: string,
  descriptor: PropertyDescriptor
) {
  descriptor.value = function () {
    const requiredFields = Reflect.getOwnMetadata(metadataKey, classPrototype);
    if (!arguments[requiredFields[0]]) {
      throw new Error('Parameter missing');
    }
  };

  return descriptor;
}

const Hai = new Greeter('Hai');
Hai.greet('Minh');
Hai.greet('Hung');
Hai.greet('Tuan'); 

Hai.greet(''); // Error: Parameter missing
```

All the above code works with >=ES6.

## Ứng dụng decorator
### #1. Classes should be open for extension, but closed for modification.
Khi cần hoặc khi thay đổi yêu cầu, việc mở rộng class là khuyến khích: thêm thuộc tính hoặc method mới. Tuy nhiên, thay đổi class là cấm kỵ. Code (Class) cũ mất nhiều thời gian, công sức để cài và fix bug. Miễn class cũ chạy tốt, không sửa nó.

Vậy làm sao nếu muốn thay đổi hành vi của một class mà không thay đổi nó? Decorator. Decorator bản chất là một **design pattern**. Mục đích của decorator là cho phép class thay đổi hành vi linh hoạt mà không đổi code cũ. 
### #2. Favor composition over inheritance.

## Hạn chế


## Chú thích
[1] _Metaprogramming_:  Metaprogramming is a programming technique in which computer programs have the ability to treat other programs as their data. It means that a program can be designed to read, generate, analyze or transform other programs, and even modify itself while running.
## Acknowledge