# ccUserAgent

## Overview 
ccUserAgent(current Chrome User Agent) is a Node.js module that determines the user agent string for the latest stable Chrome release available for Windows 10 and running
on Windows 10. It does so by first locating the latest partial version string (containing the first 3 components but missing the fourth) within Wikipedia's Chrome version history table, then searching through Google Chrome release blog posts for the latest stable desktop release with a complete version string beginning with the located partial version string and saving that complete version string. Once that is done, it returns the user agent string that corresponds to the latest Chrome release running on a Windows 10 PC.




## Usage

The module relies on asynchronous logic and takes a single parameter callback that accepts the latest Chrome on Windows 10 user agent string.

Example usage:

```
let ccUA=require('./ccUserAgent.js');

ccUA(function(userAgentString){
  console.log(userAgentString);
})

```

