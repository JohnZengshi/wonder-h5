import createEmotion from "@emotion/css/create-instance";
// Convert px to rem
function px2rem(value: string) {
  value = value.replace("px", "");
  return (parseFloat(value) / 37.5).toFixed(2) + "rem"; // 1rem = 37.5px
}
// Create an instance of emotion
export const {
  flush,
  hydrate,
  cx,
  merge,
  getRegisteredStyles,
  injectGlobal,
  keyframes,
  css,
  sheet,
  cache,
} = createEmotion({
  key: "emotion", // key for emotion cache
  stylisPlugins: [
    // stylis plugins
    (e) => {
      if (e.type == "decl") {
        e.return = e.value.replace(/(\d+(\.\d+)?)px/g, (_, p1) => px2rem(p1)); // replace px with rem
        console.log(e);
      }
    },
  ],
});

export default {
  flush,
  hydrate,
  cx,
  merge,
  getRegisteredStyles,
  injectGlobal,
  keyframes,
  css,
  sheet,
  cache,
};
