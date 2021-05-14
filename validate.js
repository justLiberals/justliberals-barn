var assert = require("assert");
var fs = require("fs");
var path = require("path");
var http = require("http");

ignored_email_errors = [
  "Element “title” must not be empty."
];

ignored_errors = [
  "No space between attributes."
];

function handleReport(path, report, isEmail) {
  errors = []
  report.messages.forEach(function (item) {
    if (!["info", "warning"].includes(item.type) && !ignored_errors.includes(item.message)) {
      if (!ignored_email_errors.includes(item.message) || !isEmail) {
        errors.push(item);
      };
    }
  });
  if (errors != []) {
    console.log(path, ": ", errors.length, " errors");
    process.exitCode = 1;
  }
  fs.writeFile(path + ".json", JSON.stringify(errors, null, 2), function (){});
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
    const options = {
      hostname: "validator.w3.org",
      path: "/nu/?out=json",
      method: "POST",
      headers: {
        "User-Agent" : "Mozilla/5.0",
        "Content-Type" : "text/html; charset=utf-8"
      }
    };
    const req = http.request(options, function (res) {
      assert(res.statusCode == 200);

      var str = "";

      res.on("data", function(chunk){
        str += chunk;
      });

      res.on("end", function(){
        handleReport(filepath, JSON.parse(str), isEmail);
      });

    });

    fs.createReadStream(filepath).pipe(req);
  };
})()
