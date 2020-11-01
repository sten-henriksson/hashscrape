const puppeteer = require('puppeteer')
const $ = require('cheerio');
const controller = require('./controller')
const model = require('./model')
var cron = require('node-cron');
//select from nohash and findhash then add hash to main table and remove from nohash and add to nodownload
async function GetMLinks(url) {
    return new Promise(resolve => {

        try {
            (async () => {

                $('a[href]', url).each(function () {
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
async function startscrape1() {

    puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async browser => {
        const page = await browser.newPage()
        let linkarray = await controller.getnohash()
        console.table(await linkarray)
        let arraylenght = linkarray.length
        for (var i = 0; i < arraylenght; i++) {
            console.log("loop")
            let name = await controller.GetNameFromMovieTable(linkarray[i].id)
            let url = 'https://thepiratebay.org/search.php?q=' + name + '&cat=0'
            url = url.split(' ').join('+')
            await page.goto(url)
            let mov = await GetMLinks(await page.content())
            controller.inserthash(mov,linkarray[i].id)
            controller.AddToNoDownloadTable(linkarray[i].id)
        }
    })

}
startscrape1()
cron.schedule('*/20 * * * *', () => {
    startscrape1()
  });