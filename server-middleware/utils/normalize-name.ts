export function normalizeName(name: string): string {
	const normalizedAuthorSplitted = name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replaceAll(", ", " ")
		.split(" ")
	for (let i = normalizedAuthorSplitted.length - 1; i >= 0; i--) {
		if (normalizedAuthorSplitted[i].includes(".")) {
			normalizedAuthorSplitted.splice(i)
		}
	}

	return normalizedAuthorSplitted.join(" ")
}
