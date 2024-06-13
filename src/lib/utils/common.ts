export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
export function formatMoney(str: string): string {
	return str ? parseFloat(str).toFixed(2) : '0';
}
