var assert = require("assert");
var fs = require("fs");
var path = require("path");
var http = require("http");

if (process.argv.length != 3) {
  console.log("Validator takes one argument ('nu' or 'w3c')");
  process.exit(1);
}

switch (process.argv[2]) {
  case "nu":
    var validator_options = {
      hostname: "validator.nu",
      path: "/?out=json",
      method: "POST",
      headers: {
        "User-Agent" : "Mozilla/5.0",
        "Content-Type" : "text/html; charset=utf-8"
      }
    };
    break;
  case "w3c":
    var validator_options = {
      hostname: "validator.w3.org",
      path: "/nu/?out=json",
      method: "POST",
      headers: {
        "User-Agent" : "Mozilla/5.0",
        "Content-Type" : "text/html; charset=utf-8"
      }
    };
    break;
  default:
    console.log("Arg must be 'nu' or 'w3c'");
    process.exit(1);
}

ignored_email_errors = [
  "Attribute “xmlns:v” not allowed here.",
  "Attribute “xmlns:o” not allowed here.",
  "Element “title” must not be empty.",
  "CSS: “mso-table-lspace”: Property “mso-table-lspace” doesn't exist.",
  "CSS: “mso-table-rspace”: Property “mso-table-rspace” doesn't exist.",
  "CSS: “text-decoration-thickness”: Property “text-decoration-thickness” doesn't exist.",
  "The “align” attribute on the “table” element is obsolete. Use CSS instead.",
  "The “cellpadding” attribute on the “table” element is obsolete. Use CSS instead.",
  "The “cellspacing” attribute on the “table” element is obsolete. Use CSS instead.",
  "The “border” attribute on the “table” element is obsolete. Use CSS instead.",
  "The “width” attribute on the “table” element is obsolete. Use CSS instead.",
  "The “align” attribute on the “td” element is obsolete. Use CSS instead.",
  "CSS: The value “break-word” is deprecated",
  "Attribute “vertical-align” not allowed on element “td” at this point.",
  "The “bgcolor” attribute on the “td” element is obsolete. Use CSS instead.",
  "CSS: “mso-padding-alt”: Property “mso-padding-alt” doesn't exist.",
  "The “valign” attribute on the “td” element is obsolete. Use CSS instead.",
  "Bad value “mailto:hello@justliberals.org.uk?subject=Weekly Briefing” for attribute “href” on element “a”: Illegal character in query: space is not allowed.",
  "Attribute “width” not allowed on element “div” at this point.",
  // Caused by templates not actually being HTML
  "Bad value “{{ validation_path }}” for attribute “href” on element “a”: Illegal character in path segment: “{” is not allowed.",
  "Bad value “{{ unsubscribe_path }}” for attribute “href” on element “a”: Illegal character in path segment: “{” is not allowed.",
  "Non-space character in page trailer.",
];

ignored_website_errors = [
  "Missing space before doctype name.",
  "No space between attributes.",
  "Duplicate ID “facebook”.",
  "Duplicate ID “twitter”.",
  "Duplicate ID “link”.",
  "Bad value “100%” for attribute “width” on element “img”: Expected a digit but saw “%” instead.",
  "Attribute “preserveaspectratio” not allowed on element “img” at this point.",
  "Attribute “focusable” not allowed on element “img” at this point.",
  "An “img” element which has an “alt” attribute whose value is the empty string must not have a “role” attribute with any value other than “none” or “presentation”",
  "An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.",
  "The “itemprop” attribute was specified, but the element is not a property of any item.",
  "Bad value “button” for attribute “type” on element “a”: Subtype missing.",
  "Discarding unrecognized token “pagination” from value of attribute “role”. Browsers ignore any token that is not a defined ARIA non-abstract role.",
  "Bad value “group” for attribute “role” on element “nav”.",
  "Bad value “” for attribute “href” on element “link”: Must be non-empty.",
  "Named character reference was not terminated by a semicolon. (Or “&” should have been escaped as “&amp;”.)",
  "The “align” attribute on the “div” element is obsolete. Use CSS instead.",
  "The value of the “for” attribute of the “label” element must be the ID of a non-hidden form control.",
  "Attribute “lang” not allowed on element “title” at this point.",
  "The “for” attribute of the “label” element must refer to a non-hidden form control.",
  "Bad value  for attribute “d” on element “path”."
];

total_errors = 0;

function handleReport(path, report, isEmail) {
  errors = [];
  report.messages.forEach(function (item) {
    if (!["info", "warning"].includes(item.type)) {
      if ((!ignored_email_errors.includes(item.message) || !isEmail) &&
          (!ignored_website_errors.includes(item.message) || isEmail)) {
        errors.push(item);
      };
    }
  });
  if (errors.length != 0) {
    console.log(path, ": ", errors.length, " errors");
    total_errors += errors.length;
    process.exitCode = 1;
    fs.writeFile(path + ".json", JSON.stringify(errors, null, 2), function (){});
  };
}

// Based on gist.github.com/lovasoa/8691344
async function* walk(dir) {
    for (const d of fs.readdirSync(dir)) {
        const entry = path.join(dir, d);
        const stats = fs.statSync(entry);
        if (stats.isDirectory()) yield* walk(entry);
        else if (stats.isFile()) yield entry;
    }
}

async function* filesToScan() {
  for await (const filename of walk(".output")) {
    if (filename.endsWith(".j2")) yield [filename, true]
    else if (filename.endsWith(".html")) yield [filename, false];
  }
}

(async function () {
  for await (const [filepath, isEmail] of filesToScan()) {
    const req = http.request(validator_options, function (res) {
      assert.strictEqual(res.statusCode, 200);

      var buffers = [];

      res.on("data", function(chunk){
        buffers.push(chunk);
      });

      res.on("end", function(){
        str = Buffer.concat(buffers).toString();
        handleReport(filepath, JSON.parse(str), isEmail);
      });

    });

    fs.createReadStream(filepath).pipe(req);
  };

  process.on('exit', function () {
    if (total_errors != 0) {
      console.log('Total errors: ', total_errors);
    } else {
      console.log("Validation successful!")
    }
  });
})()
