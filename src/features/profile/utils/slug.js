const replaceNordicChars = (value) =>
    value
        .replace(/å|ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/é|è/g, "e")
        .replace(/ü/g, "u");

export const buildProfileSlug = (firstName = "", lastName = "") => {
    const combined = `${firstName}-${lastName}`.trim().toLowerCase();
    if (!combined) return "";

    const normalized = replaceNordicChars(combined.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

    return normalized
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
};