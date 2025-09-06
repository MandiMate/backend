// utils/unitConversion.js
export const UNIT_MAP = {
    kg: { toKg: (x) => x, fromKg: (x) => x },
    maund: { toKg: (x) => x * 40, fromKg: (x) => x / 40 },
    ton: { toKg: (x) => x * 1000, fromKg: (x) => x / 1000 },
    piece: { toKg: (x) => x } // treat as 1:1 by default
};

export function convertQty(qty, fromUnit, toUnit) {
    if (fromUnit === toUnit) return Number(qty);
    if (!UNIT_MAP[fromUnit] || !UNIT_MAP[toUnit]) {
        throw new Error(`Unit conversion not supported: ${fromUnit} -> ${toUnit}`);
    }
    const inKg = UNIT_MAP[fromUnit].toKg(Number(qty));
    return Number(UNIT_MAP[toUnit].fromKg(inKg));
}
