import Image from "./opengraph-image";
import { SITE_META } from "@/content/portfolio";

export const alt = `${SITE_META.title} social preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default Image;
