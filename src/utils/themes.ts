import { Theme } from "@prisma/client";
import Color from "color";

export const themes: Record<
  Theme,
  (color?: string) => { base: string; accent: string }
> = {
  classic: () => {
    return {
      base: "#ffffff",
      accent: "#000000",
    };
  },
  dark: () => {
    return {
      base: "#000000",
      accent: "#ffffff",
    };
  },
  monochromatic: (baseColor = "#3F51B5") => {
    if (!baseColor) throw new Error("Monochromatic theme requires a color");
    const { lighter } = generateMonochromaticColors(baseColor);
    return {
      base: baseColor,
      accent: lighter,
    };
  },
};

interface MonochromaticColors {
  base: string;
  lighter: string;
  darker: string;
}

function generateMonochromaticColors(baseColor: string): MonochromaticColors {
  const color = Color(baseColor);

  const lighter = color.lighten(0.3).hex();
  const darker = color.darken(0.3).hex();

  return {
    base: baseColor,
    lighter,
    darker,
  };
}
