export type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
export function doSomething(fn: DescribableFunction) {
  console.log(`${fn.description} returned ${fn(6)}`);
}

const func: DescribableFunction = (arg) => !!arg;
func.description = 'description';
doSomething(func);
