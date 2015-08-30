using System;
using System.IO;
using System.Net;
using System.Timers;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Threading;

namespace APIGrabber
{
    class Program
    {
        // The current match API server and version for each region
        private const string urlStartBR = "https://br.api.pvp.net/api/lol/br/v2.2/match/";
        private const string urlStartEUNE = "https://eune.api.pvp.net/api/lol/eune/v2.2/match/";
        private const string urlStartEUW = "https://euw.api.pvp.net/api/lol/euw/v2.2/match/";
        private const string urlStartKR = "https://kr.api.pvp.net/api/lol/kr/v2.2/match/";
        private const string urlStartLAN = "https://lan.api.pvp.net/api/lol/lan/v2.2/match/";
        private const string urlStartLAS = "https://las.api.pvp.net/api/lol/las/v2.2/match/";
        private const string urlStartNA = "https://na.api.pvp.net/api/lol/na/v2.2/match/";
        private const string urlStartOCE = "https://oce.api.pvp.net/api/lol/oce/v2.2/match/";
        private const string urlStartRU = "https://ru.api.pvp.net/api/lol/ru/v2.2/match/";
        private const string urlStartTR = "https://tr.api.pvp.net/api/lol/tr/v2.2/match/";
        private const string urlEnd = "?includeTimeline=true&api_key=";

        /// <summary>
        /// Replace YOUR API KEY HERE with your API key
        /// </summary>
        private const string yourAPI = "YOUR API KEY HERE";

        // Be sure to change this to a timer that fits your API Rate and Internet Speed
        private System.Timers.Timer t = new System.Timers.Timer(40); // 40ms

        private int index = 0;
        private List<long> matchIds = new List<long>();
        private string region;
        private object _lock = new object();
        CountdownEvent _countdown;

        private static void Main(string[] args)
        {
            Program p = new Program();
            p.Start();
        }

        private void Start()
        {
            // This is our timer and timer event to make sure we try
            // our best to stay within the rate restrictions
            t.Elapsed += new ElapsedEventHandler(DownloadFiles);

            #region BR
            if (Properties.Resources.BR != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.BR);
                region = "BR";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region EUNE
            if (Properties.Resources.EUNE != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.EUNE);
                region = "EUNE";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region EUW
            if (Properties.Resources.EUW != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.EUW);
                region = "EUW";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region KR
            if (Properties.Resources.KR != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.KR);
                region = "KR";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region LAN
            if (Properties.Resources.LAN != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.LAN);
                region = "LAN";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region NA
            // Reads the NA.json file provided by Riot (it is currently in the projects root directory)
            if (Properties.Resources.NA != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.NA);
                region = "NA";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region LAS
            if (Properties.Resources.LAS != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.LAS);
                region = "LAS";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region OCE
            if (Properties.Resources.OCE != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.OCE);
                region = "OCE";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region RU
            if (Properties.Resources.RU != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.RU);
                region = "RU";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            }
            #endregion

            #region TR
            if (Properties.Resources.TR != null)
            {
                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<long>>(Properties.Resources.TR);
                region = "TR";

                // Begin the download for this region
                t.Start();

                // Add wait signal to finish region before moving on
                _countdown = new CountdownEvent(matchIds.Count);
                _countdown.Wait();

                // Reset state for next region
                matchIds.Clear();
                t.Stop();
                index = 0;
            } 
            #endregion
        }

        private void DownloadFiles(object sender, ElapsedEventArgs e)
        {
            int thisIndex;
            bool sucess = false;

            // Lock the index to ensure thread-safe manipulation
            lock (_lock)
            {
                thisIndex = index;
                index++;
            }

            if (thisIndex < matchIds.Count)
            {
                while (!sucess)
                {
                    try
                    {
                        string urlStart = string.Empty;

                        #region Select Correct Region URL
                        switch (region)
                        {
                            case "BR":
                            {
                                urlStart = urlStartBR;
                                break;
                            }
                            case "EUNE":
                            {
                                urlStart = urlStartEUNE;
                                break;
                            }
                            case "EUW":
                            {
                                urlStart = urlStartEUW;
                                break;
                            }
                            case "KR":
                            {
                                urlStart = urlStartKR;
                                break;
                            }
                            case "LAN":
                            {
                                urlStart = urlStartLAN;
                                break;
                            }
                            case "LAS":
                            {
                                urlStart = urlStartLAS;
                                break;
                            }
                            case "NA":
                            {
                                urlStart = urlStartNA;
                                break;
                            }
                            case "OCE":
                            {
                                urlStart = urlStartOCE;
                                break;
                            }
                            case "RU":
                            {
                                urlStart = urlStartRU;
                                break;
                            }
                            case "TR":
                            {
                                urlStart = urlStartTR;
                                break;
                            }
                        }
                        #endregion

                        // Dynamically creates the API path, and downloads the JSON String
                        var response = new WebClient().DownloadString(urlStart + matchIds[thisIndex] + urlEnd + yourAPI);

                        // This is path where the file will save, including the filename
                        // Feel free to change this as you see fit
                        var path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "//MatchData//" + region + "//"
                                + region + (thisIndex + 1) + " - " + matchIds[thisIndex] + ".json";

                        // Write the file
                        File.WriteAllText(path, response);

                        sucess = true;
                    }
                    catch (WebException)
                    {
                        // On the off chance you get a 429 response, it will retry
                        sucess = false;
                    }
                }

                // Provide a nice update message
                Console.WriteLine("Finished file " + (thisIndex + 1) + " of " + matchIds.Count + " for region: " + region);
                _countdown.Signal();
            }
            else
            {
                // Stop the timer in the case that we have finished a region
                t.Stop();
            }
        }
    }
}
