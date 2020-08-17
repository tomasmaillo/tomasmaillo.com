$(document).ready(function() {
    updateTheme();
});


// Coloful theme 

$("#change-theme-btn").click(function () {
    updateTheme();
});


function updateTheme(){
    let color = getRandomColor();
    document.documentElement.style.setProperty("--bbackground", color + "22");
    document.documentElement.style.setProperty("--foreground-default", color + "ff");
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



// Toggle project filters

$(".key-holder").click(function () {
    $(this).toggleClass($(this).attr('id'));
    $(".project-holder." + $(this).attr('id')).toggle("hidden");
});
