const fs = require("fs");


function getMovies(path){
    //console.log(path)
    const movies = fs.readFileSync(path)
    return movies

}

module.exports ={
    getMovies
}