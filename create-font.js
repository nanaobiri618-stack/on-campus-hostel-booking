const fs = require("fs");

const interFontBase64 = `
d09GRgABAAAAAA1QABAAAAAAE/wAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABqAAAABwA
AABED0eXXXXXX....(very long base64 removed for space)....
`;

const buffer = Buffer.from(interFontBase64.replace(/\s+/g, ""), "base64");

// ensure folder exists
fs.mkdirSync("app/fonts", { recursive: true });

fs.writeFileSync("app/fonts/Inter-Regular.woff2", buffer);

console.log("Inter-Regular.woff2 created successfully!");