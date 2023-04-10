import { Theme } from "@prisma/client";
import Color from "color";

export interface ThemeData {
  bgColor: string;
  inputBgColor: string;
  placeholderColor: string;
  textColor: string;
  buttonColor: string;
  borderColor: string;
  borderFocusedColor: string;
}

export const themes: Record<Theme, (color?: string) => ThemeData> = {
  classic: () => {
    return {
      bgColor: "#ffffff",
      inputBgColor: "#ffffff",
      placeholderColor: "",
      textColor: "#000000",
      buttonColor: "#3F51B5",
      borderFocusedColor: "#aeaeae",
      borderColor: "#aeaeae",
    };
  },
  dark: () => {
    return {
      bgColor: "#232323",
      inputBgColor: "#232323",
      placeholderColor: "",
      textColor: "#ffffff",
      buttonColor: "#fff",
      borderFocusedColor: "#464646",
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

  const bgColor = color.lighten(0.97).hex();
  const inputBgColor = color.lighten(0.9).hex();
  const borderFocusedColor = color.lighten(0.3).hex();
  const borderColor = color.lighten(0.7).hex();

  // Choose textColor based on the higher contrast ratio
  const textColor =
    Color(bgColor).contrast(Color("#ffffff")) >=
    Color(bgColor).contrast(Color("#000000"))
      ? "#ffffff"
      : "#000000";

  return {
    buttonColor: baseColor,
    bgColor,
    inputBgColor,
    textColor,
    borderColor,
    borderFocusedColor,
    placeholderColor: "",
  };
}
