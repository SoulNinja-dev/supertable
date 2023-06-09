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
  popupColor: string;
}

export const themes: Record<Theme, (color?: string) => ThemeData> = {
  classic: () => {
    return {
      bgColor: "#ffffff",
      inputBgColor: "#f2f2f2",
      popupColor: "#fafafa",
      placeholderColor: "",
      textColor: "#000000",
      buttonColor: "#000000",
      borderFocusedColor: "#000000",
      borderColor: "#aeaeae",
    };
  },
  dark: () => {
    return {
      bgColor: "#232323",
      inputBgColor: "#303030",
      popupColor: "#2b2b2b",
      placeholderColor: "",
      textColor: "#ffffff",
      buttonColor: "#fff",
      borderFocusedColor: "#8f8d8d",
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
  const borderColor = color.lighten(0.6).hex();
  const popupColor = color.lighten(0.94).hex();

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
    popupColor,
    placeholderColor: "",
  };
}
