export type Primitive = number | string | boolean;
export type HashFunction = (...args: any[]) => string;

export interface MemoizeCache {
    get(key: Primitive): any | undefined;

    has(key: Primitive): boolean;

    set(key: Primitive, value: any): void;
}

export type MemoizeCacheFactory = () => MemoizeCache;

export interface MemoizeOptions {
    hashFunction?: HashFunction;
    cacheFactory: MemoizeCacheFactory;
}

const isPrimitive = (value: unknown): value is Primitive =>
    value === null ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'string';

export function Memoize(args?: Partial<MemoizeOptions> | HashFunction): MethodDecorator {
    const options = normalizeOptions(args);

    return function(target, propertyKey, descriptor) {

        if (descriptor?.value) {
            descriptor.value = getNewFunction(
                descriptor.value as any,
                options?.hashFunction,
                options.cacheFactory,
                Symbol()
            ) as any;
        } else if (descriptor?.get) {
            descriptor.get = getNewFunction(
                descriptor.get,
                options?.hashFunction,
                options.cacheFactory,
                Symbol()
            );
        } else {
            throwNonDecoratableDefinitionError();
        }
    };
}

function getNewFunction<T>(
    originalMethod: () => T,
    hashFunction: (...args: unknown[]) => string,
    cacheFactory: MemoizeCacheFactory,
    storageKey: symbol
): () => T {
    return function(...args: unknown[]) {
        if (args.length > 0) {
            return getNonZeroArgsDecorator.call(
                this,
                originalMethod,
                args,
                hashFunction,
                cacheFactory,
                storageKey
            );
        } else {
            return getZeroArgsDecorator.call(this, originalMethod, storageKey);
        }
    };
}

function normalizeOptions(options: Partial<MemoizeOptions> | HashFunction | undefined): MemoizeOptions {
    const defaultCacheFactory = () => new Map();

    if (options === undefined) {
        return { cacheFactory: defaultCacheFactory };
    }

    if (typeof options === 'function') {
        options = { hashFunction: options, cacheFactory: defaultCacheFactory };
    }

    if (!options.cacheFactory) {
        options.cacheFactory = defaultCacheFactory;
    }

    return options as MemoizeOptions;
}

function getZeroArgsDecorator<T>(originalMethod: () => T, storageKey: symbol): unknown {

    if (!this[storageKey]) {
        this[storageKey] = originalMethod.apply(this);
    }

    return this[storageKey];
}

function getNonZeroArgsDecorator<T, A extends unknown[]>(
    originalMethod: (...args: A) => T,
    args: A,
    hashFunction: (...args: A) => string,
    cacheFactory: MemoizeCacheFactory,
    storageKey: symbol
): unknown {
    let returnedValue: T;

    if (!this[storageKey]) {
        this[storageKey] = cacheFactory();
    }

    const cache = this[storageKey];
    let hashKey: Primitive;

    if (hashFunction) {
        hashKey = hashFunction.apply(this, args);
    } else if (args.every(isPrimitive)) {
        hashKey = (args as Primitive[]).reduce((acc, curr, index) => {
            return acc + (index ? ':' : '') + curr
        }, '');
    } else {
        throwNonPrimitiveArgsError();
    }

    if (cache.has(hashKey)) {
        returnedValue = cache.get(hashKey);
    } else {
        returnedValue = originalMethod.apply(this, args);
        cache.set(hashKey, returnedValue);
    }

    return returnedValue;
}

function throwNonDecoratableDefinitionError(): void {
    throw new Error('Only put a Memoize() decorator on a method or get accessor.');
}

function throwNonPrimitiveArgsError() {
    throw new Error(`You are applying decorator to a method that accepts arguments of non-promitive types.
Please provide and explicit hashFunction that deterministically converts arguments
to a primitive type, like so: @Memoize((u: User, c: Company)=>\`\${u.id}:\${c.id}\`)`);
}
