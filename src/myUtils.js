// // https://github.com/gi-ts/base/blob/master/packages/%40gi-types/soup3/index.d.ts
// Soup = imports.gi.Soup
// session = Soup.Session.new()
// // msg = Soup.Message.new("GET", "https://docs.gtk.org/gio/method.InputStream.read.html")
// msg = Soup.Message.new("GET", "https://www.google.com/search?q=salat+fajr+setif")
// session.accept_language = 'en, fr';
// session.user_agent = 'Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36 Chrome/104 ';
// /* // method Soup.Session.send(msg, cancellable) {
// //     wrapper for native symbol soup_session_send()
// // }
// // gInputStream = session.send(msg, null);

// // https://docs.gtk.org/gio/method.InputStream.read.html
// // method Gio.InputStream.read(count, cancellable) {
// //     wrapper for native symbol g_input_stream_read()
// // }
// // gInputStream.read() */


// let byte = session.send_and_read(msg, null); // https://libsoup.org/libsoup-3.0/method.Session.send_and_read.html
// let data = byte.get_data(); // https://docs.gtk.org/glib/method.Bytes.get_data.html
// string = new TextDecoder().decode(data); // https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string



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
    let session = Soup.Session.new();
    let msg = Soup.Message.new('GET', url);
    // https://stackoverflow.com/a/39987462
    session.accept_language = 'en, fr';
    session.user_agent = 'Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36 Chrome/104 ';
    let buffer = session.send_and_read(msg, null).get_data();
    let data = new TextDecoder().decode(buffer);
    return cb(null, data);
}

function clean(status_code, body) {
    let matches = body.match(regex);
    matches = matches.map(match => match.replace(`">`, ` `).replace(` `, ` `));
    return matches;
}