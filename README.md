# Much Brawlers

## Main Info
The website for this project can be found at [**Much Brawlers**](http://foxslash.com/much-brawlers).

This project was created for the [**The Riot Games API Challenge 2.0**](https://developer.riotgames.com/discussion/announcements/show/2lxEyIcE).  Our aim was to create a website that analyzed champion statistics throughout a 24 hour period and determined the win and pick rate for each champion at specific 30 minute intervals.  We also display the buy and win rate of each brawler as well as the percentages of those that didn't buy a brawler at all.

We also calculated the win rate of champions whether they bought the new Black Market items or not.  We display that information in addition to the pick, ban, and untouched rates as well as the highest/average kills, deaths, assists, gold earned, minion kills, tower kills, and wards placed on each champion's individual page.

The final page shows some miscellaneous "other" data: a death heatmap, number of twenty-minute surrenders, number of less than 20 minute games, number of total Teemo deaths, and a funny "50% Global Win Rate" (for every win, somebody else loses).

## [Back-End](data%20setup/)
Using C# and Microsft SQL Server 2014 Management Studio, we created a program to download all the match data (including timeline data) and organized it into a database.  From there we could make queries that we then converted into JSON files that the website can easily parse.

## [Front-End](site/)
We used HTML, CSS, and JavaScript to create the website.  We included Highcharts, jQuery, and jQuery UI in order to simplify some chart drawing as well as general JavaScript programming and element animation.  The entire front-end is one singular page that shows and hides elements as the user switches between content.  Statistics are loaded from JSON files that were mentioned previously.

## Support
This site has been tested on:
- Internet Explorer >= 10
- Edge
- Chrome >= 38
- Firefox >= 35
- Opera >= 30

At screen resolutions >= 1366x768 with JavaScript enabled, the site displays properly.  This in no way means other browsers won't work correctly, just that it should work for this software.


## Legal
"Much Brawlers" isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.

## License
Copyright (c) 2015 Jon Stirling and Matthew Clark

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.