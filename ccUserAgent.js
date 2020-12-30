/*  ccUserAgent(current Chrome User Agent) is a Node.js module that determines the user agent string for
*   the latest stable Chrome release available for Windows 10 and running
*   on Windows 10. It does so by first locating the latest partial version string
*   (containing the first 3 components but missing the fourth) within Wikipedia's
*   Chrome version history table, then searching through Google Chrome release blog
*   posts for the latest stable desktop release with a complete version string
*   beginning with the located partial version string, and finally returning
*   a standard Chrome on Windows 10 user agent string with the complete version string
*   inserted into it.
 */

const r=require('request');
const c=require('cheerio');

/*  Determines the latest Chrome partial version string. The version this function obtains
*   is missing one set of version numbers. The function obtains the partial version string
*   by downloading Wikipedia's Chrome version history table and locating the latest
*   stable version string there. Once it has done so, it calls the callback with
*   this version string.*
*/
function determineLatestChromePV(cb) {
    let reqOpt = {
        url: 'https://en.wikipedia.org/wiki/Google_Chrome_version_history',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
        }
    };
    r(reqOpt, function (e, r, b) {
        const $ = c.load(b);
        let latestChromePV = '';
        $('.wikitable tr').each(function () {
            const chromePV = $(this).find('td').first().text().trim();
            const color = $(this).find('td').first().css('background');
            if (color === '#a0e75a') {
                latestChromePV = chromePV;
            }
        });
        cb(latestChromePV)
    })
}


/*  Determines the full version string associated with the latest stable desktop Chrome
*   release. It does so by searching through Google's Chrome release blog posts,
*   locating the most recent one with both the title 'Stable Channel Update for Desktop'
*   and post contents containing the passed in partial version string, and saving
*   from within that post the entire version string that starts with the partial version
*   string. Once the latest Chrome full version string has been found, the function calls
*   the callback with that string.
*/
function determineLatestChromeFV(lcpv,cb) {
    const reqOpt = {
        url: 'https://chromereleases.googleblog.com/search/label/Stable%20updates',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
        }
    };
    r(reqOpt, function (e, r, b) {
        const $ = c.load(b);
        let fullChromeV = '';
        let fcvSaved = 0;
        $('div .post').each(function () {
            if ($(this).find('a').first().text().trim() === 'Stable Channel Update for Desktop') {
                const postBody = $(this).find('.post-body').text();
                if (postBody.indexOf(lcpv) !== -1 && fcvSaved === 0) {
                    fullChromeV = postBody.slice(postBody.indexOf(lcpv), postBody.indexOf(' ', postBody.indexOf(lcpv)));
                    fcvSaved = 1;
                }
            }
        });
        cb(fullChromeV);
    })
}

//  Determines and returns the user agent string associated with the
//  latest stable Chrome release running on Windows 10.
function determineLatestChromeUAS(lcfv){
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/'
        + lcfv + ' Safari/537.36';
}

/*  Exports function that determines and calls callback with the latest Chrome
*   user agent string. It does so by calling determineLatestChromePV(),
*   then, via callback, determineLatestChromeFV(), then, again via callback,
*   determineLatestChromeUAS().
 */
module.exports = function determineLatestChromeUAS_AIO(cb) {
    determineLatestChromePV(function (lcpv) {
        determineLatestChromeFV(lcpv, function (lcfv) {
            console.log(determineLatestChromeUAS(lcfv));
        });
    });
};

