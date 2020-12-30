# ccUserAgent

ccUserAgent(current Chrome User Agent) is a Node.js module that determines the user agent string for the latest stable Chrome release release available for Windows 10 and running
on Windows 10. It does so by first locating the latest partial version string (containing the first 3 components but missing the fourth) within Wikipedia's Chrome version history table, then searching through Google Chrome release blog posts for the latest stable desktop release with a complete version string beginning with the located partial version string, and finally returning a standard Chrome on Windows 10 user agent string with the complete version string inserted into it.
