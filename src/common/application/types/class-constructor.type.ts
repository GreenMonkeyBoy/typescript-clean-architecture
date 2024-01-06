/** A constructor function that accepts any number of arguments and returns an instance of type 'T'. */
export type ClassConstructor<T> = {
  new (...args: any[]): T
}
