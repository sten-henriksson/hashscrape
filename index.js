const puppeteer = require('puppeteer')
const screenshot = 'youtube_fm_dreams_video.png'
const $ = require('cheerio');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "moviedb"
});
//select from nohash and findhash then add hash to main table and remove from nohash and add to nodownload

function AddToNoDownloadTable(id) {
    var sql = "INSERT INTO nodownload (id) VALUES (?)";
    con.query(sql, [id], function (err, result) {
        if (err) throw err;
        console.log("id inserted " + id);

    });
}
function GetNameFromMovieTable(id) {

    return new Promise(resolve => {
        var sql = "SELECT name FROM movies WHERE id = ?";
        con.query(sql, [id], function (err, result) {
            if (err) throw err;

            if (result.length) {
                resolve(result[0].name)
                console.log("get name" + id + " " + result[0].name);
            }

        });
    });
}
function DelNoHash(id) {
    var sql = "DELETE FROM nohash WHERE id = ?";
    con.query(sql, [id], function (err, result) {
        if (err) throw err;
        console.log("id deleted " + id);

    });
}
function NoHashTable() {
    return new Promise(resolve => {
        con.query("SELECT * FROM nohash", function (err, result, fields) {
            if (err) throw err;
            resolve(result)
        });
    });
}
function addhashtomovies(hash, id) {
    var sql = "UPDATE movies SET hash = '" + hash + "' WHERE id = '" + id + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("hash updated ");

    });
}

async function startscrape() {
    var idarr = await NoHashTable();
    for(let id = 0;id<idarr.length;id++){
        console.log("id = " + idarr[id].id)
        var mlink = await GetMLinks('https://thepiratebay.org/search.php?q=' + await GetNameFromMovieTable(idarr[id].id) + '&cat=0')
        addhashtomovies(mlink, idarr[id].id);
        AddToNoDownloadTable(idarr[id].id);
        DelNoHash(idarr[id].id); 
    }
}
function GetMLinks(url) {
    return new Promise(resolve => {

        try {
            (async () => {
                const browser = await puppeteer.launch()
                const page = await browser.newPage()
                await page.goto(url)
                //console.log(await page.content())

                $('a[href]', await page.content()).each(function () {
                    if ($(this).attr('href')[0] == "m") {
                        resolve($(this).attr('href'))
                    }

                    //resolve($(this).text())


                });
            })()
        } catch (err) {
            console.error(err)
        }
    });
}



startscrape()

