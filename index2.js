const controller = require('./controller')
const foo = async () => {
    console.log("name" + await controller.GetNameFromMovieTable(90))
}
foo


async function asd(){
    console.log("name" + await controller.GetNameFromMovieTable(90))
}
asd()