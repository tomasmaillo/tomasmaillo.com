$.get("https://api.thingspeak.com/channels/676492/feeds.json?results=1", function(data) {

    data["feeds"].forEach(element => {

        $("#current-temp").text(element["field1"] + "°C");
        $("#current-hum").text(element["field2"] + "%");
        console.log(new Date(element["created_at"]))
        $("#temp-updated-time").text(dateToNiceString(new Date(element["created_at"])));
    });
});

// Not my code
function dateToNiceString(myDate) {
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return month[myDate.getMonth()] + " " + myDate.getDate() + " " + myDate.getFullYear() + " " + strTime;
}