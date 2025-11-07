type Primitive = string | number | boolean | null | undefined;

export type QueryValue = Primitive | Primitive[];

export function buildQueryString(params: Record<string, QueryValue>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, rawValue]) => {
    if (rawValue === undefined || rawValue === null) {
      return;
    }

    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    values.forEach((value) => {
      if (value === undefined || value === null) {
        return;
      }

      if (typeof value === "number" && !Number.isFinite(value)) {
        return;
      }

      const stringValue = String(value).trim();
      if (!stringValue.length || stringValue === "all") {
        return;
      }

      searchParams.append(key, stringValue);
    });
  });

  return searchParams.toString();
}
