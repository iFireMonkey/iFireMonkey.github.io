$(document).ready(function() {
    $('#volSlider').slider({
        value: song.volume,
        min: 0,
        max: 1,
        range: 'min',
        animate: true,
        step: .1,
        slide: function(e, ui) {
            song.volume = ui.value;
        }
    });
    var sec = -1;
    function pad(val) {
        return val > 9 ? val : "0" + val;
    }
    setInterval(function() {
        $("#seconds").html(pad(++sec % 60));
        $("#minutes").html(pad(parseInt(sec / 60, 10) % 60));
        $("#hours").html(pad(parseInt(sec / 3600, 10)));
    }, 1000);
    var sock = io("ws://92.222.1.56:1000/");
    sock.on("users", function(data) {
        $("#onlineusers").html(data.i);
    });
});
$.fn.randomize = function(childElem) {
    return this.each(function() {
        var $this = $(this);
        var elems = $this.children(childElem);
        elems.sort(function() {
            return (Math.round(Math.random()) - 0.5);
        });
        $this.remove(childElem);
        for (var i = 0; i < elems.length; i++)
            $this.append(elems[i]);
    });
}
;
$(function() {
    $(".banners").randomize('a.item');
    var bFirst = $(".banners .item:first");
    bFirst.addClass('active');
    $(".banners .item:not(.active)").hide();
    var cycle = true;
    var bSpeed = 500;
    var bInterval = 7000;
    var bTick = setInterval(function() {
        if (cycle === true)
            nextBan();
    }, bInterval);
    var nextBan = function() {
        var $wrap = $(".banners");
        var bActive = $(".banners .item.active");
        var bNext = bActive.next(".item");
        if (bNext.length === 0)
            bNext = bFirst;
        var bOption = {
            top: "-=" + $wrap.height()
        };
        bActive.removeClass("active").animate(bOption, bSpeed);
        bNext.show().addClass("active").css("top", $wrap.height()).animate(bOption, bSpeed);
    };
    $(".banners .item").on({
        mouseenter: function() {
            cycle = false;
        },
        mouseleave: function() {
            cycle = true;
        }
    });
});
var audio = document.getElementById("song");
function playsong() {
    song.play();
}
audio.volume = 0.4;
function pausesong() {
    song.pause();
}
var image = "assets/images/Onesie.png";
var no = 15;
var time = 0;
var speed = 60;
var i, dwidth = 700, dheight = 870;
var nht = dheight;
var toppos = 0;
if (document.all) {
    var ie4up = 1;
} else {
    var ie4up = 0;
}
if (document.getElementById && !document.all) {
    var ns6up = 1;
} else {
    var ns6up = 0;
}
function getScrollXY() {
    var scrOfX = 10
      , scrOfY = 10;
    if (typeof (window.pageYOffset) == 'number') {
        scrOfY = window.pageYOffset;
        scrOfX = window.pageXOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        scrOfY = document.body.scrollTop;
        scrOfX = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        scrOfY = document.documentElement.scrollTop;
        scrOfX = document.documentElement.scrollLeft;
    }
    return [scrOfX, scrOfY];
}
var timer;
function ranrot() {
    var a = getScrollXY()
    if (timer) {
        clearTimeout(timer);
    }
    toppos = a[1];
    dheight = nht + a[1];
    timer = setTimeout('ranrot()', 2000);
}
ranrot();
function iecompattest() {
    if (document.compatMode && document.compatMode != "BackCompat") {
        return document.documentElement;
    } else {
        return document.body;
    }
}
if (ns6up) {
    dwidth = window.innerWidth;
    dheight = window.innerHeight;
} else if (ie4up) {
    dwidth = iecompattest().clientWidth;
    dheight = iecompattest().clientHeight;
}
nht = dheight;
var cv = new Array();
var px = new Array();
var py = new Array();
var am = new Array();
var sx = new Array();
var sy = new Array();
for (i = 0; i < no; ++i) {
    cv[i] = 0;
    px[i] = Math.random() * (dwidth - 200);
    py[i] = Math.random() * dheight;
    am[i] = Math.random() * 20;
    sx[i] = 0.02 + Math.random() / 10;
    sy[i] = 0.7 + Math.random();
    document.write("<div id=\"dot" + i + "\" style=\"POSITION: absolute; Z-INDEX: 5; VISIBILITY: visible; TOP: 15px;LEFT: 15px;\"><img src='" + image + "' border=\"0\"><\/div>");
}
function animation() {
    for (i = 0; i < no; ++i) {
        py[i] += sy[i];
        if (py[i] > dheight - 50) {
            px[i] = Math.random() * (dwidth - am[i] - 100);
            py[i] = toppos;
            sx[i] = 0.02 + Math.random() / 10;
            sy[i] = 0.7 + Math.random();
        }
        cv[i] += sx[i];
        document.getElementById("dot" + i).style.top = py[i] + "px";
        document.getElementById("dot" + i).style.left = px[i] + am[i] * Math.sin(cv[i]) + "px";
    }
    atime = setTimeout("animation()", speed);
}
function hideimage() {
    if (window.atime)
        clearTimeout(atime)
    for (i = 0; i < no; i++)
        document.getElementById("dot" + i).style.visibility = "hidden"
}
if (ie4up || ns6up) {
    animation();
    if (time > 0)
        setTimeout("hideimage()", time * 1000)
}
animation();
