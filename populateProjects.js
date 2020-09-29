$.get("https://api.thingspeak.com/channels/1118584/feeds.json", function(data) {

    $("#projects-last-update").text(dateToNiceString(new Date(data["channel"]["updated_at"])))
    data["feeds"].forEach(element => {

        let newProject = "";

        newProject += `
        <div class="project-holder ` + element["field2"] + `">
            <p class="project-title">` + element["field1"] + `</p>
            <p class="project-description">` + element["field3"] + `</p>
            <div class="project-links">`;

        newProject += element["field4"] != null ? `<a target="_blank" href="` + element["field4"] + `"><i class="fa fa-github"></i>GitHub</a>` : ``;
        newProject += element["field5"] != null ? `<a target="_blank" href="` + element["field5"] + `"><i class="fa fa-chain"></i>Site</a>` : ``;
        newProject += element["field6"] != null ? `<a href="` + element["field6"] + `"><i class="fa fa-eye"></i>The story behind</a>` : ``;

        $("#projects-list").append(newProject);

    });


});