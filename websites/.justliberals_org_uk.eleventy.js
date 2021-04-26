const fs = require("fs");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const ghostContentAPI = require("@tryghost/content-api");

// Init Ghost API
const api = new ghostContentAPI({
  url: 'https://admin.justliberals.org.uk',
  key: process.env.GHOST_CONTENT_API_KEY,
  version: "v2"
});


// Strip Ghost domain from urls
const stripDomain = url => {
  return url.replace("https://admin.justliberals.org.uk", "");
};

module.exports = function(config) {
  // Copy over images
  config.addPassthroughCopy({"websites/justliberals_org_uk/images": "assets/images"});

  // Assist RSS feed template
  config.addPlugin(pluginRSS);

  // Date formatting filter
  config.addFilter("htmlDateString", dateObj => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  // Get all posts
  config.addCollection("posts", async function(collection) {
    collection = await api.posts
      .browse({
        include: "tags,authors",
        limit: "all",
        filter: 'tag:justLiberals'
      })
      .catch(err => {
        console.error(err);
      });

    collection.forEach(post => {
      post.url = stripDomain(post.url);
      post.primary_author.url = stripDomain(post.primary_author.url);
      post.tags.map(tag => (tag.url = stripDomain(tag.url)));
      if (post.tags.some(tag => tag.name == "ALDES")) {
        post.canonical = "ALDES"
      };

      // Convert publish date into a Date object
      post.published_at = new Date(post.published_at);
    });

    // Bring featured post to the top of the list
    collection.sort((post, nextPost) => nextPost.featured - post.featured);

    return collection;
  });

  // Get all authors
  config.addCollection("authors", async function(collection) {
    collection = await api.authors
      .browse({
        limit: "all"
      })
      .catch(err => {
        console.error(err);
      });

    // Get all posts with their authors attached
    const posts = await api.posts
      .browse({
        include: "authors",
        limit: "all",
        filter: 'tag:justLiberals'
      })
      .catch(err => {
        console.error(err);
      });

    // Attach posts to their respective authors
    collection.forEach(async author => {
      const authorsPosts = posts.filter(post => {
        post.url = stripDomain(post.url);
        post.published_at = new Date(post.published_at);
        return post.primary_author.id === author.id;
      });
      if (authorsPosts.length) author.posts = authorsPosts;

      author.url = stripDomain(author.url);

      // Stripping redundant characters into a "short" website url
      if (author.website) {
        author.website_short = author.website.replace(/https?:\/\/w*\.?/, '');
        author.website_short = author.website_short.replace(/\/$/, '');
      }
    });

    return collection;
  });

  // Display 404 page in BrowserSnyc
  config.setBrowserSyncConfig({
    port: 8081,
    ghostMode: false,
    ui: false,
    callbacks: {
      ready: (err, bs) => {
        const content_404 = fs.readFileSync(".output/websites/justliberals_org_uk/error.html");

        bs.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  config.addWatchTarget("websites/justliberals_org_uk/scss/");

  // Eleventy configuration
  return {
    dir: {
      input: "websites/justliberals_org_uk",
      output: ".output/websites/justliberals_org_uk"
    },

    // Files read by Eleventy, add as needed
    templateFormats: ["css", "njk", "md", "txt"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
