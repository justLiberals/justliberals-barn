# justLiberals barn
The justLiberals barn is where all the assets are kept.

## Why?
Assets for various parts of justLiberals were kept across a few places, and it was hard to track. It's also hard to on-board new people when you need to start with a map of where everything is (there was also a small amount of copy-paste engineering going on between repositories..).

Although it would be possible to split out some of these assets, keeping them all in one place makes it clear and easy to understand where everything is kept - in the barn!

## What?
These are the things currently in the barn:

### Websites (under `websites/`)
justLiberals hosts the following websites:
- [justLiberals.org.uk](https://www.justliberals.org.uk/)
- [aldes.org.uk](https://www.aldes.org.uk/)

These are static websites, built using the [Eleventy](https://www.11ty.dev/) static site generator from templates written in [Nunjucks](https://mozilla.github.io/nunjucks/) that are based on [Bootstrap](https://getbootstrap.com/). Currently the website sources articles from a [Ghost](https://ghost.org/) instance. We avoid cookies, JavaScript and third party assets - [see below](#Why-don't-you-use-Cookies/JavaScript/Trackers/etc?) for details.

You can spin up a version of the website using `npm start`, but first you'll have to add the `GHOST_CONTENT_API_KEY` as an environment variable. This will start a local copy of both justLiberals.org.uk (on port `8081`) and aldes.org.uk (on port ``8082`). [See below](#I'd-like-to-contribute) for more information about contributing.

### Emails (under `emails/`)
justLiberals sends both transactional emails and newsletters, which are kept under their namesake directories. TEXT versions of emails are written in [Jinja](https://jinja.palletsprojects.com/en/2.11.x/); HTML emails are built in [mjml](https://mjml.io/) (which is then compiled to Jinja on deployment). These are deployed to our [Meadow](https://github.com/GrassfedTools/terraform-aws-meadow) instance, which uses them for our newsletters.

You can see your mjml changes live [with their app](https://mjmlio.github.io/mjml-app/), or their plugins for [VS Code](https://marketplace.visualstudio.com/items?itemName=mjmlio.vscode-mjml) and [Atom](https://atom.io/packages/mjml-preview).

### Articles
_Coming soon_

## Why don't you use Cookies/JavaScript/Trackers/etc?

justLiberals is a project formed and focused around Liberalism - as such, it's obvious to us that Liberalism should be baked into our offerings. We do not currently have a functional need for Cookies or JavaScript, so we don't use them. We also don't consider it right to track visitors to our websites or consumers of our content, so we don't do that either. The only data we have is what [CloudFront](https://aws.amazon.com/cloudfront/) (our CDN provider) logs, and although we do also keep an eye on [Google Search Console](https://search.google.com/search-console/about) - to see what people are searching for when they land up on our website - we don't use Google Analytics, Facebook Pixel or any other third party tracker.

Note: while we have principles, we are not blind to nuance or necessity - if we build something that requires a cookie, or some browser-based JavaScript, we will use it. There's nothing inherently wrong with these tools - we just don't need them right now.

## I'd like to contribute

Awesome! You can clone this repository, install [Node.js](https://nodejs.org/en/), run `npm install` from within the directory and you're off to the races.

### Step-by-step
Want some more guidance? Follow these steps:
1. Install [Visual Studio Code](https://code.visualstudio.com/), which we will use for editing files.
1. Install [Git](https://git-scm.com/downloads). If you're using the installer then select _"Use Visual Studio Code"_ as the default editor. Leave all other settings as their defaults.
1. Install the LTS edition of [Node.js](https://nodejs.org/en/) - note that if you're doing this on Windows, be sure to check the box to _"Automatically install the necessary tools"_ (this is going to take a while, and open up a few different Command and PowerShell windows in the process). Leave all other settings as their defaults.
1. Open Visual Studio Code and click _"clone repository..."_. A box will open at the top, to which you should copy and paste the HTTPS URL for this repository (`https://github.com/justLiberals/justliberals-barn.git`). Then press enter.
1. VS Code will ask you where you want to put the repository - the default is fine, so click _"Select Repository Location"_. Then click "Open" in the box on the bottom-right.
1. You now have a directory tree on the left of all the files and folders in the repository.

#### Website contributions
1. Click _"Terminal"_ on the menu bar, then _"New Terminal"_ to open a terminal window.
1. Type `npm install`, then once that's done type `npm start`.
1. You can now browse to:
  - `http://localhost:8081/` to find a local instance of _justLiberals.org.uk_
  - `http://localhost:8082/` to find a local instance of _aldes.org.uk_
  Both sites will reload whenever you make a change in their respective subdirectories under `websites/`

#### Email contributions
1. Go to the _"Extensions"_ tab (the three blocks + one block on the left hand side) and type `mjmlio.vscode-mjml` in the search bar at the top. Then click _"Install"_ next to the MJML item.
1. Once this has finished installing, go back to the file browser (the document on the left-hand side) and open `emails/transactional/validate_HTML.j2.mjml`.
1. Click the red mjml icon on the top right and a rendering of the mjml tempate will be presented to you.

This gives an overview of how you can contribute, but feel free to ask questions in the #jl-project channel on the Discord for more information.