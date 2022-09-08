export default function declensionWord(num: number): string {
  const n = Math.abs(num) % 100;
  const n1 = num % 10;
  if (n > 10 && n < 20) {
    return "товаров";
  }
  if (n1 > 1 && n1 < 5) {
    return "товара";
  }
  if (n1 === 1) {
    return "товар";
  }
  return "товаров";
}
