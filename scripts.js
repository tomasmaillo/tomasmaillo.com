function updateTheme() {
  let color = getRandomColor();
  document.documentElement.style.setProperty("--background", color + "44");
  document.documentElement.style.setProperty(
    "--foreground-default",
    color + "ff"
  );
  document.documentElement.style.setProperty("--a", color + "22");
}

updateTheme();
setInterval(updateTheme, 2000);

console.log("here");
console.log("HEREEEEE");
console.log("asdasfdfsdfdsf");
console.log("here");
console.log("here");
console.log("HEree");
console.log("here");
console.log("here");
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
