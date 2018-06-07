
'use strict';
const Handlebars = require('handlebars');


$(document).ready(() => {


    // Promo
    const json = {
        "themeName": "promotion-light-theme",///alternative:promotion-dark-theme or promotion-light-theme
        "alignment": "end",//alternative:end
        "head-class": "promo-heading",//alternative:
        "copy-text-class": "promo-copy-text",
        "target": "_blank",//alternative:"",
        "backgroundImageAlt":"whatever",
        "imageHeight":"536px"

    };
    if (json.themeName.trim()=="" ) {json.themeName="default";}
    var cta = 1; //alternative: 0
    if (!cta) {
        json["head-class"] = "promo-heading-no-cta";
        json["copy-text-class"] = "lead";
        json["display"]="d-none";
    }
    // if hasmobilebackgroundimage d-none
    $(".component.full-width-promotion").wrap("<script id='handlebars-template' type='text/x-handlebars-template'></script>");
    var handlebarsTemplate = $("#handlebars-template").html();
    var template = Handlebars.compile(handlebarsTemplate);
    var data = template(json);
    $("#template").html(data);
    $('#handlebars-template').remove();

    // hero-promotion
    
    // // if hasmobilebackgroundimage d-none
    // $(".component.hero-promotion").wrap("<script id='handlebars-template2' type='text/x-handlebars-template'></script>");
    // var handlebarsTemplate2 = $("#handlebars-template2").html();
    // var template = Handlebars.compile(handlebarsTemplate2);
    // var data = template(json);
    // $("#template2").html(data);
    // $('#handlebars-template2').remove();

});