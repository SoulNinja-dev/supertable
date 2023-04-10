import { Theme } from "@prisma/client";
import Color from "color";

export interface ThemeData {
  bgColor: string;
  textColor: string;
  buttonColor: string;
  borderColor: string;
}

export const themes: Record<Theme, (color?: string) => ThemeData> = {
  classic: () => {
    return {
      bgColor: "#ffffff",
      textColor: "#000000",
      buttonColor: "#3F51B5",
      borderColor: "#aeaeae",
    };
  },
  dark: () => {
    return {
      bgColor: "#232323",
      textColor: "#ffffff",
      buttonColor: "#fff",
      borderColor: "#464646",
    };
  },
  monochromatic: (baseColor = "#3F51B5") => {
    if (!baseColor) throw new Error("Monochromatic theme requires a color");
    return generateMonochromaticColors(baseColor);
  },
};

function generateMonochromaticColors(baseColor: string): ThemeData {
  const color = Color(baseColor);

  const bgColor = color.lighten(0.8).hex();
  const darker = color.lighten(0.3).hex();

  // Calculate contrast ratio
  const contrastWithWhite = Color(bgColor).contrast(Color("#ffffff"));
  const contrastWithBlack = Color(bgColor).contrast(Color("#000000"));

  // Choose textColor based on the higher contrast ratio
  const textColor =
    contrastWithWhite >= contrastWithBlack ? "#ffffff" : "#000000";

  return {
    buttonColor: baseColor,
    bgColor,
    textColor,
    borderColor: darker,
  };
}
