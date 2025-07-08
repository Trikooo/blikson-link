const css = `/* Example: Scalar theme override for testing */
div.min-w-0[data--h-bstatus] {
      display: none !important;
}
.light-mode {
  --scalar-button-1-color: #EDEDED;
  --scalar-button-1: #006239;
  --scalar-button-1-hover: #3D7052;
  --scalar-color-accent: #6CCC93;
}

.dark-mode {
  --scalar-button-1-color: #EDEDED;
  --scalar-button-1: #006239;
  --scalar-button-1-hover: #3D7052;
  --scalar-color-accent: #00B268;
}
:root {
  --scalar-radius: 6px;
}

`;
export default css;
