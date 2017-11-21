$('.slider-images-coworking-wr').slick({
    dots: true
    , arrows: true
    , infinite: true
    , speed: 300
    , slidesToShow: 1
});
$(".one-user-state").each(function () {
    let width = count_time_width($(this).find(".from").text(), $(this).find(".to").text());
    let margin = 0;
    if ($(this).find(".from").text() != '00:00') {
        margin = count_time_width('00:00', $(this).find(".from").text());
    }
    $(this).css({
        "width": width + "%"
        ,"left": margin + "%"
    });
});

function count_time_width(firstDate, secondDate) {
    let getDate = (string) => new Date(0, 0, 0, string.split(':')[0], string.split(':')[1]);
    let different = (getDate(secondDate) - getDate(firstDate));
    let differentRes, hours, minuts;
    if (different > 0) {
        differentRes = different;
        hours = Math.floor((differentRes % 86400000) / 3600000);
        minuts = Math.round(((differentRes % 86400000) % 3600000) / 60000);
    }
    else {
        differentRes = Math.abs((getDate(firstDate) - getDate(secondDate)));
        hours = Math.floor(24 - (differentRes % 86400000) / 3600000);
        minuts = Math.round(60 - ((differentRes % 86400000) % 3600000) / 60000);
    }
    return (hours * 60 + minuts) * 0.06941667;
}