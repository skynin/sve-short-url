// place files you want to import through the `$lib` alias in this folder.

export function trimFirstSymbol(str: string, symbol: string = '/') {
while(str.length > 0 && str.charAt(0) === symbol) {
  str = str.substring(1);
}
return str
}