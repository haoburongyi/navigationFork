function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function replaceParamVal(url, paramName, replaceVal) {
    var oUrl = url.toString();
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    var nUrl = oUrl.replace(re, paramName + '=' + replaceVal);
    return nUrl;
}

function setCookie(cname, cvalue, exsecond) {
    var d = new Date();
    d.setTime(d.getTime() + (exsecond * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

function getArrayIndex(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return i;
        }
    }
    return -1;
}

var f_Array = "";

$(function () {
    $.getJSON("static/nav.json", function (data) {
        var strHtml = "";
        $.each(data, function (infoIndex, info) {
            var navstr = "";
            var navtitle = "";
            strHtml += "<li><a href='#" + info["_id"] + "'><span class ='" + info["icon"] + "'></span>" + info["classify"] + "</a></li>";
            navtitle += "<div class='box box_default'><a href='#' id='" + info["_id"] + "'></a> <div class='sub-category'> <div><span class='" + info["icon"] + "'></span>" + info["classify"] + "</div> </div><div>";
            $.each(info["sites"], function (i, str) {
                if (str["logo"] == "no-logo") {
                    str["logo"] = "static/logo.svg";
                }
                navstr += '<a target="_blank" href="' + str["href"] + '">';
                navstr += '<div class="item">';
                navstr += '    <div class="logo">'
                navstr += '       <img src="' + str["logo"] + '"></div> ';
                navstr += '   <div class="content"><strong>' + str["name"] + '</strong><p class="desc">' + str["desc"] + '</p></div>';
                navstr += '</div>      </a>';
            })
            navstr = navtitle + navstr + '</div>';
            $(".footer").before(navstr);
        })
        $("#navItem").append(strHtml);
        enableSearch(data); // 启用搜索功能
    })

    // 搜索功能
    function enableSearch(data) {
        $("#searchBox").on("input", function () {
            var query = $(this).val().toLowerCase();
            var suggestions = data.reduce((acc, category) => {
                var matches = category.sites.filter(site => site.name.toLowerCase().includes(query) || site.desc.toLowerCase().includes(query) || site.href.toLowerCase().includes(query));
                return acc.concat(matches.map(site => `<a href="${site.href}" target="_blank">${site.name}</a>`));
            }, []);
            
            $("#suggestions").html(suggestions.join(""));
        });

        $("#searchBox").on("keypress", function (e) {
            if (e.which == 13) { // Enter key pressed
                var query = $(this).val().toLowerCase();
                var match = data.reduce((acc, category) => {
                    return acc.concat(category.sites.filter(site => site.name.toLowerCase().includes(query) || site.desc.toLowerCase().includes(query) || site.href.toLowerCase().includes(query)));
                }, [])[0];
                
                if (match) {
                    window.location.href = match.href;
                }
            }
        });
    }
});
