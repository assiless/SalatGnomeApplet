const { Clutter, Gio, GLib, Soup, St } = imports.gi;
const Lang = imports.lang;
const regex = new RegExp(`(?<=data-attrid=")(?:Fajr|Sunrise|Dhuhr|Asr|Maghrib|Isha).*?(?=</div)`, 'gm');

/*
// ################ ASync ################
TODO https://stackoverflow.com/questions/60214850/asynchronous-soup-calls

function get(url, callback) {
    let _session = new Soup.SessionAsync();
    let request = Soup.Message.new('GET', url);
    // https://stackoverflow.com/a/39987462
    _session.accept_language = 'en, fr';
    _session.user_agent = 'Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36 Chrome/104 ';
    _session.queue_message(request, Lang.bind(this,
        function (session, message) {
            callback(message.status_code, request.response_body.data);
        }
    )
    );
}

getData(url, function (status_code, body) {
    matches = body.match(regex);
    matches = matches.map(match => match.replace(`">`, `,`));
    // log(matches[0]);
}); 
*/

// ################ Sync ################
function get(url, cb) {
    // https://stackoverflow.com/a/43818634/16077720
    let sessionSync = new Soup.SessionSync();
    let msg = Soup.Message.new('GET', url);
    // https://stackoverflow.com/a/39987462
    sessionSync.accept_language = 'en, fr';
    sessionSync.user_agent = 'Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36 Chrome/104 ';
    status_code = sessionSync.send_message(msg);
    return cb(status_code, msg.response_body.data);
}


function clean(status_code, body) {
    let matches = body.match(regex);
    matches = matches.map(match => match.replace(`">`, `,`));
    return matches;
}