const fs = require("fs");


function getMovies(path){
    //console.log(path)
    const movies = fs.readFileSync(path)
    return movies

}

function readMovies(path, newjson){

    fs.writeFileSync(path,newjson)
}

module.exports ={
    getMovies,
    readMovies
}