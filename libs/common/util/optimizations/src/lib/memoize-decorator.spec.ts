import { Memoize, MemoizeCache, Primitive } from './memoize-decorator';

interface MockUser {
    id: number;
    name: string
}

const nonDecoratableDefinitionError = 'Only put a Memoize() decorator on a method or get accessor.';
const nonPrimitiveArgsError = `You are applying decorator to a method that accepts arguments of non-promitive types.
Please provide and explicit hashFunction that deterministically converts arguments
to a primitive type, like so: @Memoize((u: User, c: Company)=>\`\${u.id}:\${c.id}\`)`;

class MockCache implements MemoizeCache {
    cache = {};

    static normalizeKey(key: Primitive): string | number {
        return typeof key === 'boolean' ? +key : key;
    }

    get(key: Primitive): any | undefined {
        return this.cache[MockCache.normalizeKey(key)];
    }

    has(key: Primitive): boolean {
        return !!this.cache[MockCache.normalizeKey(key)];
    }

    set(key: Primitive, value: any): void {
        this.cache[MockCache.normalizeKey(key)] = value;
    }
}

describe('Memoize', () => {

    describe('when decorating a get accessor', () => {
        const spy = jest.fn();

        class MockClass {
            constructor(private v: number) {
            }

            @Memoize()
            get value(): number {
                spy();
                return this.v;
            }
        }

        beforeEach(() => spy.mockClear());

        it('should memoize return value of get accessor', () => {
            const a = new MockClass(1);

            expect(a.value).toEqual(1);
            expect(a.value).toEqual(1);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should not share get accessor cache between multiple class instances', () => {
            const a = new MockClass(1);
            const b = new MockClass(2);

            expect(a.value).toEqual(1);
            expect(b.value).toEqual(2);
            expect(spy).toHaveBeenCalledTimes(2);
        });
    });

    describe('when decorating a method', () => {

        describe('when decorating a method without arguments', () => {
            const spy = jest.fn();

            beforeEach(() => spy.mockClear());

            class MyClass {
                @Memoize()
                getNumber(): number {
                    spy();
                    return Math.random();
                }
            }

            it('should memoize return value of niladic method', () => {
                const a = new MyClass();
                expect(a.getNumber()).toEqual(a.getNumber());
                expect(spy).toHaveBeenCalledTimes(1);
            });

            it('should not share niladic method cache between multiple class instances', () => {
                const a = new MyClass();
                const b = new MyClass();
                expect(a.getNumber()).not.toEqual(b.getNumber());
                expect(spy).toHaveBeenCalledTimes(2);
            });
        });

        describe('when decorating a method with arguments', () => {

            describe('when hash function is provided', () => {
                const spy = jest.fn();

                beforeEach(() => spy.mockClear());

                class MockClass {
                    @Memoize((u: MockUser) => `${u.id}`)
                    getGreeting(user: MockUser): string {
                        spy();
                        return `Hello, ${user.name}`;
                    }
                }

                it('should memoize return value for arguments that produce the same hash', () => {
                    const a = new MockClass();

                    expect(a.getGreeting({ id: 1, name: 'John' })).toEqual('Hello, John');
                    expect(a.getGreeting({ id: 1, name: 'John' })).toEqual('Hello, John');
                    expect(spy).toHaveBeenCalledTimes(1);
                });

                it('should re-evaluate for arguments that produce different hash', () => {
                    const a = new MockClass();

                    expect(a.getGreeting({ id: 1, name: 'John' })).toEqual('Hello, John');
                    expect(a.getGreeting({ id: 2, name: 'John' })).toEqual('Hello, John');
                    expect(spy).toHaveBeenCalledTimes(2);
                });

                it('should not share cache between different instances of the same class', () => {
                    const a = new MockClass();
                    const b = new MockClass();

                    expect(a.getGreeting({ id: 1, name: 'Alice' })).toEqual('Hello, Alice');
                    expect(b.getGreeting({ id: 1, name: 'Alice' })).toEqual('Hello, Alice');
                    expect(spy).toHaveBeenCalledTimes(2);
                });
            });

            describe('when hash function is not provided', () => {

                describe('when arguments are primitive', () => {

                    describe('when decorating monadic method', () => {
                        const spy = jest.fn();

                        beforeEach(() => spy.mockClear());

                        class MockClass {
                            @Memoize()
                            getGreeting(name: string): string {
                                spy();
                                return `Hello, ${name}`;
                            }
                        }

                        it('should memoize return value of monadic method', () => {
                            const a = new MockClass();

                            expect(a.getGreeting('John')).toEqual('Hello, John');
                            expect(a.getGreeting('John')).toEqual('Hello, John');
                            expect(spy).toHaveBeenCalledTimes(1);
                        });

                        it('should return different values for different arguments', () => {
                            const a = new MockClass();

                            expect(a.getGreeting('Alice')).toEqual('Hello, Alice');
                            expect(a.getGreeting('Bob')).toEqual('Hello, Bob');
                            expect(spy).toHaveBeenCalledTimes(2);
                        });

                        it('should not share monadic method cache between different class instances', () => {
                            const a = new MockClass();
                            const b = new MockClass();

                            expect(a.getGreeting('Alice')).toEqual('Hello, Alice');
                            expect(b.getGreeting('Alice')).toEqual('Hello, Alice');
                            expect(spy).toHaveBeenCalledTimes(2);
                        });
                    });

                    describe('when decorating polyadic method', () => {
                        const spy = jest.fn();

                        beforeEach(() => spy.mockClear());

                        class MyClass {
                            @Memoize()
                            getSum(a: number, b: number): number {
                                spy();
                                return a + b;
                            }
                        }

                        it('should memoize return value of monadic method', () => {
                            const a = new MyClass();

                            expect(a.getSum(1, 2)).toEqual(3);
                            expect(a.getSum(1, 2)).toEqual(3);
                            expect(spy).toHaveBeenCalledTimes(1);
                        });

                        it('should return different values for different arguments', () => {
                            const a = new MyClass();

                            expect(a.getSum(1, 2)).toEqual(3);
                            expect(a.getSum(2, 2)).toEqual(4);
                            expect(spy).toHaveBeenCalledTimes(2);
                        });

                        it('should not share polyadic method cache between different class instances', () => {
                            const a = new MyClass();
                            const b = new MyClass();

                            expect(a.getSum(1, 2)).toEqual(3);
                            expect(b.getSum(1, 2)).toEqual(3);
                            expect(spy).toHaveBeenCalledTimes(2);
                        });
                    });
                });

                describe('when arguments are not primitive', () => {
                    class MyClass {
                        @Memoize()
                        multiply(a: number, b: { id: number, value: number }): number {
                            return a * b.value;
                        }
                    }

                    it('should throw an error asking for explicit hashFunction', () => {
                        const a = new MyClass();

                        expect(() => a.multiply(1, { id: 1, value: 2 })).toThrowError(nonPrimitiveArgsError);
                    });

                });
            });
        });
    });

    describe('when decorating non-supported definitions', () => {
        it('should throw an error if decorator is added to class definition', () => {
            expect(() => {
                // @ts-ignore
                @Memoize()
                class MyClass {
                }
            }).toThrow(nonDecoratableDefinitionError);
        });

        it('should throw an error if decorator is added to set accessor', () => {
            expect(() => {
                class MyClass {

                    @Memoize()
                    set name(name: string) {
                    }
                }
            }).toThrow(nonDecoratableDefinitionError);
        });
    });

    describe('test cache implementations', () => {
        const spy = jest.fn();

        class MockClassWithCustomCacheFactory {
            @Memoize({ cacheFactory: () => new MockCache() })
            getGreeting(name: string) {
                spy(name);
                return `Hello, ${name}`;
            }
        }

        class MockClassWithoutCustomCacheFactory {
            @Memoize({ hashFunction: (name) => name })
            getGreeting(name: string) {
                spy(name);
                return `Hello, ${name}`;
            }
        }

        beforeEach(() => spy.mockClear());

        it('should apply custom cache factory if it is provided', () => {
            const instance = new MockClassWithCustomCacheFactory();

            instance.getGreeting('Alice');
            instance.getGreeting('Alice');
            instance.getGreeting('Bob');
            expect(spy).toHaveBeenCalledTimes(2);
            instance.getGreeting('Martha');
            instance.getGreeting('Martha');
            expect(spy).toHaveBeenCalledTimes(3);
        });

        it('should apply default cache factory if no custom cache factory is provided', () => {
            const instance = new MockClassWithoutCustomCacheFactory();

            instance.getGreeting('Alice');
            instance.getGreeting('Alice');
            instance.getGreeting('Bob');
            expect(spy).toHaveBeenCalledTimes(2);
            instance.getGreeting('Martha');
            instance.getGreeting('Martha');
            expect(spy).toHaveBeenCalledTimes(3);
        });
    });
});
