// place files you want to import through the `$lib` alias in this folder.

export function trimFirstSymbol(str: string, symbol: string = '/') {
  while(str.length > 0 && str.charAt(0) === symbol) {
    str = str.substring(1)
  }
  return str
}

/**
 * The maximum is inclusive and the minimum is inclusive
 */
export function getRandomInt(min:number, max:number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
