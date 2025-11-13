import slugify from "slugify";

// Helper function to create a custom slug
export function createSlug(title: string): string {
  return slugify(title, {
    lower: true,
    locale: "en",
    replacement: "-",
    remove: /[^\w\s-]/g, // ✅ Yalnız hərf, rəqəm, boşluq və "-" saxla
    strict: true, // ✅ Bütün xüsusi simvolları sil
  });
}
