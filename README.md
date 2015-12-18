#Final Project
###SpooderDeadLonks!
The basic concept of this web application is to help testers find dead links on a specifc page.[Link to website](https://warm-oasis-2618.herokuapp.com)

###version 1.0
- currently only supports <a> tag recognition.
- has a check for http link urls
- api for spidering for ajax call!(when hosted)


###API usage instruction!
- to use simply make a post request to https://warm-oasis-2618.herokuapp.com/spider with:
    + {url: http://example.com}

after a bit you will receive a json object with all the atags on that page along with the status code for each link.

###Tech involved
- node
    + express
    + cheerio
    + bodyparser
    + request-promise
- angular
- jquery
- bootstrap
- animate.css
- angular loading bar

If you have any questions regarding this application feel free to email me @ jukyokim1992@gmail.com
