 export const ThemeColors = () => {
   let rootStyle = getComputedStyle(document.body);
   return {
      themeColor1 : rootStyle.getPropertyValue("--theme-color-1").trim(),
      themeColor2 : rootStyle.getPropertyValue("--theme-color-2").trim(),
      themeColor3 : rootStyle.getPropertyValue("--theme-color-3").trim(),
      themeColor4 : rootStyle.getPropertyValue("--theme-color-4").trim(),
      themeColor5 : rootStyle.getPropertyValue("--theme-color-5").trim(),
      themeColor6 : rootStyle.getPropertyValue("--theme-color-6").trim(),
      themeColor1_10 : rootStyle.getPropertyValue("--theme-color-1-10").trim(),
      themeColor2_10 : rootStyle.getPropertyValue("--theme-color-2-10").trim(),
      themeColor3_10 : rootStyle.getPropertyValue("--theme-color-3-10").trim(),
      themeColor4_10 : rootStyle.getPropertyValue("--theme-color-3-10").trim(),
      themeColor5_10 : rootStyle.getPropertyValue("--theme-color-3-10").trim(),
      themeColor6_10 : rootStyle.getPropertyValue("--theme-color-3-10").trim(),
      primaryColor: rootStyle.getPropertyValue("--primary-color").trim(),
      foregroundColor: rootStyle.getPropertyValue("--foreground-color").trim(),
      separatorColor: rootStyle.getPropertyValue("--separator-color").trim(),
      /* traffic light heatmap */
      // naColor: "#d3d3d3",
      // verylowColor: "#2dc937",
      // lowColor: "#99c140",
      // mediumColor: "#e7b416",
      // highColor: "#db7b2b",
      // veryhighColor: "#cc3232"
      // welsh levels of care heatmap
      naColor: "#d3d3d3",
      verylowColor:"#92cddc",
      lowColor: "#92d050",
      mediumColor: "#f5f504",
      highColor: "#ffc000",
      veryhighColor: "#ff0000"
      /* colourblind traffic light heatmap */
      // naColor: "#d3d3d3",
      // verylowColor: "#e5fe7b",
      // lowColor: "#fee919",
      // mediumColor: "#e7b416",
      // highColor: "#db7b2b",
      // veryhighColor: "#cc3232"
  }
};