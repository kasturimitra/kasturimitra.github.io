# The Making of Words

<div class="date">29th July 2018</div>

A few weeks back (from when I wrote this), I made this new design for my blog. I was
frankly unimpressed by what it looked like earlier and also bothered by the amount of
effort I had to make just to add a new bunch of ideas on here. I also wanted $ \LaTeX $
and Google Prettify in there, and possibly other things (such as Jupyter Notebooks) soon.

So here's a blog on the making of this blog, *and how I reduced the amount of effort I had
to make the three times every year when I did have a new blog entry.*

#### The Basic Idea

Here's how this looked in my head before I approached this: I write a new entry in a
Markdown file. I put the Markdown file somewhere in my blog assets and had a page load
the contents from it, parse it, and add the generated HTML into a template, which would
then be styled by the same sass file that styles my blog.

That's it. It's simple, it's sweet, and it took less than thirty minutes to make. Well,
other than the design.

#### Creating a Structure

Here's what my directory structure looks like:

~~~
blog/
    assets/
        files/
            ...
    css/
        blog.css
    js/
        script.js
        showdown.min.js
    index.html
    blog.html
~~~

Let's at from the top.

The `assets/files/` directory is where I keep all my blog entries, philosophy essays, and
other random thoughts as Markdown files. These are what I will access and try to render in
HTML.

The `css/` directory contains, well, the compiled CSS (I use Sass). It
also probably contains some other resources, but since I wouldn't be going over the
design in much detail, I don't think that it should be necessary to mention the secrets
that the folder contains.

The `js/` directory is where the magic happens. It holds my own script and
[showdown.js](https://github.com/showdownjs/showdown) - a resource that should get all the
credit for this page and all the other pages on this blog.

Finally, the two HTML files. The first, `index.html`, is the blog home. You can go and
check mine out [here](/blog/). This contains links to all the entries. The second,
`blog.html` is what will render each and every entry. Sort of like a master template. And,
hence, it's this one that we shall focus on.

Let's take a peek into it:

~~~html
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Your Blog's Title</title>

        <!-- The Stylesheet -->
        <link rel="stylesheet" type="text/css" href="css/blog.css">

        <!-- The Scripts -->
        <script type="text/javascript" src="js/showdown.js"></script>
        <script type="text/javascript" src="js/script.js"></script>
    </head>
    <body>
        <div id="markdownContainer"></div>
    </body>
</html>
~~~

And that's all you need in the HTML file! Surely, you might add things here and there to
give it a personal touch, like I have with my emblem and footer, but this is sufficient
to 'embed' the Markdown into our document.

For the final step, we shall take a look at the script that makes this all happen. All the
magic we've been waiting for.

#### How I Learned to Stop Worrying and Love the Bomb

Now, we need to write the script and here's what it should do:

1. Look at the URI and get which file to read, parse, and embed.
2. Open the file.
3. Parse the file, and add the HTML content to the markdownContainer element.

Let's begin.

##### Getting the Query from the URI

If you go to the address bar, you will notice that the URI goes something like this:

~~~cpp
/blog/blog.html?q=blog.md
~~~

This is my way of letting my script know that the file I need to be rendered into the
blog template is `blog.md`. This could very well be any markdown file. So let's write a
function which can process the URI and extract the value of `q`:

~~~js
function getParameterByName(key) {
    url = window.location.href;
    key = key.replace(/[\[\]]/g, '\\$&');
    regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)');
    key = regex.exec(url);
    if (!key) return null; if (!key[2]) return '';
    return decodeURIComponent(key[2].replace(/\+/g, ' '));
}
~~~

This extracts the `value` from the expression which is of the form
`?&k1=v1&k2=v2&...&key=value&...kn=vn` through some neat RegEx as suggested on
[this Stack Overflow forum](https://stackoverflow.com/a/901144). So, if you fire up your
development console on this tab and run the following command, you should probably get
`blog.md`!

~~~js
getParameterByName("q");
~~~

##### Parsing Markdown and Generating HTML

Here's where `showdown.js`, our all-important resource is necessary. Let's see how this is
done in a few simple lines by showdown:

~~~js
function getHTMLContent(data) {
    var converter = new showdown.Converter();
    var html      = converter.makeHtml(data);
    return html;
}
~~~

That's it! After having read the file data, we can just create a showdown converter object
and let it do the job for us. This returns the HTML content which we can subsequently add
to our markdownContainer element.

##### Putting Everything Together

For the final steps, let's get the file name when the window loads, read the file, parse
it and add it to our HTML.

~~~js
window.onload = function() {
    var mdFile = "assets/files/" + getParameterByName("q");
    fetch(mdFile)
        .then(response => {
            if (!response.ok) {
                return "#Error\n\nCannot read or open file.";
            }
            return response.text();
        }).then(data => {
            var html      = getHTMLContent(data);
            var mdElement = document.getElementById("markdownContainer");
            mdElement.innerHTML += html;
        })
}

~~~

Here, we first get the name of the file and append it to the directory where it is
contained. Following that, we try to open it, and if it doesn't open, send an error
message to the next step. If it does, though, we just send the contents of the file
forward. Here, we get the parsed and converted HTML content, and add it to the element
which we have created in the blog as the dedicated markdown container.

And that's it! Surely, as I have, many things can be added to this. Latex support,
Google's Prettify, Jupyter Notebook support, a loading icon, your own CSS, and even more.
This, though, serves as a solid foundation.
