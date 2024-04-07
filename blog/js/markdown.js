function getParameterByName(key) {
    url = window.location.href;
    key = key.replace(/[\[\]]/g, '\\$&');
    regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)');
    key = regex.exec(url);
    if (!key) return null; if (!key[2]) return '';
    return decodeURIComponent(key[2].replace(/\+/g, ' '));
}

window.onload = function() {
    'use strict';

    var mdFile = "assets/files/" + getParameterByName("q");

    if (mdFile.substring(mdFile.length - 2, mdFile.length) == "md") {
        console.log("Markdown file found.");
    }
    else {
        console.log("Cannot open non-markdown files.");
        mdFile += "thesearenotthedroidsyouarelookingfor"
    }

    var defaultResponse =
        "# Words\n" +
        "<center>\n" +
        "## Request Error\n\n" +
        "Either the blog entry doesn't exist or the URL is invalid. Please check the URL.\n" +
        "Format:\n~~~cpp\n/blog/blog.html?q=<file.md>\n~~~\n" +
        "Sorry for the trouble! ☹" +
        "</center>";
    var text;

    fetch(mdFile)
        .then(response => {
            if (!response.ok) {
                return defaultResponse;
            }
            return response.text();
        }).then(data => {
            var converter = new showdown.Converter();
            var html      = converter.makeHtml(data);
            var mdElement = document.getElementById("markdown");
            mdElement.innerHTML += html;
            var codeTags  = document.getElementsByTagName('pre');
            Array.prototype.forEach.call(codeTags, function(el) {
                el.classList.add("prettyprint");
            });
            PR.prettyPrint();
        })
}
