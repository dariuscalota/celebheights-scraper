
var Promise = require('bluebird');
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');

console.time('Execution started');

var urls = [
    'http://www.celebheights.com/s/allA.html',
    'http://www.celebheights.com/s/allB.html',
    'http://www.celebheights.com/s/allC.html',
    'http://www.celebheights.com/s/allD.html',
    'http://www.celebheights.com/s/allE.html',
    'http://www.celebheights.com/s/allF.html',
    'http://www.celebheights.com/s/allG.html',
    'http://www.celebheights.com/s/allH.html',
    'http://www.celebheights.com/s/allI.html',
    'http://www.celebheights.com/s/allJ.html',
    'http://www.celebheights.com/s/allK.html',
    'http://www.celebheights.com/s/allL.html',
    'http://www.celebheights.com/s/allM.html',
    'http://www.celebheights.com/s/allN.html',
    'http://www.celebheights.com/s/allO.html',
    'http://www.celebheights.com/s/allP.html',
    'http://www.celebheights.com/s/allQ.html',
    'http://www.celebheights.com/s/allR.html',
    'http://www.celebheights.com/s/allS.html',
    'http://www.celebheights.com/s/allT.html',
    'http://www.celebheights.com/s/allU.html',
    'http://www.celebheights.com/s/allV.html',
    'http://www.celebheights.com/s/allW.html',
    'http://www.celebheights.com/s/allX.html',
    'http://www.celebheights.com/s/allY.html',
    'http://www.celebheights.com/s/allZ.html'
];

var celebrities = [];

var i = 0,idx=0;
var pause = 10 * 1000;

var fetch = function (url) {
    console.log('Processing', url);
    return new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            var body = "";
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(body);
            })
        });
    });
};

var getHeightInCm = function (txt) {
    init = txt.indexOf('(');
    fin = txt.indexOf(')');
    return txt.substr(init + 1, fin - init - 1);
};

var processLists = function (url) {
    fetch(url)
        .then(function (body) {
            $ = cheerio.load(body);
            return $('.sAZ2.v11');
        })
        .then(function (celebs) {
            celebs.each(function () {
                var celeb = {}, str, name, height, celeburl;

                str = $(this).text();
                name = $(this).children().text();
                celeburl = $(this).children().first().attr('href');

                celeb.name = name;
                celeb.height = getHeightInCm(str);
                celeb.url = celeburl;
                
                if(celeb.name.length > 0 && celeb.height.length>0 && url.length>0){
                    
                // return fetch(celeburl).then(function(body){
                //     $$ = cheerio.load(body);
                //     return $$('.actorimg').attr('src') || "";
                // });
                    celebrities.push(celeb);
                
                }

            });
            return;
        })
        .then(function (result) {
            console.log('Finished', celebrities.length);
            if (++i < urls.length) {
                processLists(urls[i]);
            }
            else {
                console.log('No more to process, exiting.');
                processCelebrity(idx);
            }
        })
        .catch(function (err) {
            throw err;
        });
}

var processCelebrity = function(idx){
    fetch(celebrities[idx].url)
        .then(function (body) {
            $ = cheerio.load(body);

            celebrities[idx].img = $('.actorimg').attr('src') || "";
            celebrities[idx].bio = $('.starDesc').text() || "";
            delete celebrities[idx].url;
            
            return true;
        })
        .then(function (result) {
            console.log('Finished ', celebrities[idx]);
            if (++idx < celebrities.length) {
                processCelebrity(idx);
            }
            else {
                console.log('All finished');
                console.log('All finished');
                console.log('All finished');
                console.log('All finished');
                console.log('All finished');
                console.log('All finished');
                console.log('All finished');
                console.log('All finished');
                fs.writeFile("data.json", JSON.stringify(celebrities), function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                }); 
                console.timeEnd('Execution finished');
            }
        })
        .catch(function (err) {
            throw err;
        });
} 
 
processLists(urls[i]);