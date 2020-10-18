const puppeteer = require('puppeteer')
const $ = require('cheerio');
const controller = require('./controller')
//select from nohash and findhash then add hash to main table and remove from nohash and add to nodownload
async function GetMLinks(url) {
    return new Promise(resolve => {

        try {
            (async () => {
                //console.log(await page.content())

                $('a[href]',url).each(function () {
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

async function startscrape() {

    puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async browser => {
        const page = await browser.newPage()
        var idarr = await controller.getnohash();
        idarr.forEach(async function (element) {
            console.log("id = " + element.id)
            let name = await controller.GetNameFromMovieTable(element.id)
            let url = 'https://thepiratebay.org/search.php?q=' + name + '&cat=0'
            await page.goto(url)
            await page.waitFor(1100)
            let mov = await GetMLinks(await page.content())
            controller.inserthash(mov, element.id)
            controller.AddToNoDownloadTable(element.id)

        });
    })

}

startscrape()

