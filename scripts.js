// Toggle dark - light theme

$("#change-theme-btn").click(function () {
    $("body").toggleClass("dark");
    if ($('body').hasClass('dark')) {
        $("#change-theme-btn").text("🌞")
    } else {
        $("#change-theme-btn").text("🌘");
    }
});


// Theme depending on client local time
console.log(Date.now().toString());

if ((new Date().getHours() <= 7) || (20 <= new Date().getHours())) {
    console.log("night")
    
} else {
    console.log("day")
    $("body").toggleClass("dark");
}


// Show project story
/*
$(".project-holder").click(function () {
    if ($(this).attr('id') !== undefined) {
        $(this).append("<iframe src='" + $(this).attr('id') + ".html'></iframe>");
        $(this).removeAttr('id');
    }
    else {
        $(this).append("<p class='project-description'>No story behind this one sorry</p>");
    }
});
*/

// Toggle project filters

$(".key-holder").click(function () {
    $(this).toggleClass($(this).attr('id'));
    $(".project-holder." + $(this).attr('id')).toggle("hidden");
});
