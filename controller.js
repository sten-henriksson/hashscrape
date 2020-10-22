const model = require('./model')
exports.inserthash = async function inserthash(magnet, insertid) {
    let movobj = await model.movieList.findOne({
        where: {
            id: insertid
        }
    });
    movobj.magnet = magnet
    movobj.save();
}
exports.AddToNoDownloadTable = async function AddToNoDownloadTable(insertid) {
    await model.todownload.upsert({
        id: insertid
    })
}
exports.GetNameFromMovieTable = async function GetNameFromMovieTable(insertid) {
    let a = await model.movieList.findOne({
        where: {
            id: insertid
        }
    });
    let name = a.name
    name = name.replace(" ","+")
    return a.name
}
exports.getnohash = async function getnohash() {
    let a = await model.movieList.findAll({
        where: {
            magnet: null
        }
    });
    return a
}
exports.getall = async function getnohash() {
    let a = await model.movieList.findAll({
    });
    return a
}
