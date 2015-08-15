using System;
using System.IO;
using System.Net;
using System.Timers;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace APIGrabber
{
    class Program
    {
        // The current NA match API server and version
        private const string urlStart = "https://na.api.pvp.net/api/lol/na/v2.2/match/";
        private const string urlEnd = "?includeTimeline=true&api_key=";

        // -------------------------------------------
        // Replace YOUR API KEY HERE with your API key
        // -------------------------------------------
        private const string yourAPI = "YOUR API KEY HERE";

        private int index = 0;
        private List<int> matchIds = new List<int>();
        private Timer t = new Timer(1200); // 1200ms = 1.2seconds

        private static void Main(string[] args)
        {
            Program p = new Program();
            p.Start();
        }

        private void Start()
        {
            // Reads the NA.json file provided by Riot (it is currently in the projects root directory)
            using (StreamReader reader = new StreamReader("../../NA.json"))
            {
                string json = reader.ReadToEnd();

                // JsonConvert is part of the NewtonSoft.Json library
                // Read More - http://www.newtonsoft.com/json
                matchIds = JsonConvert.DeserializeObject<List<int>>(json);

                // This is our timer and timer event to make sure we try
                // our best to stay within the rate restrictions
                t.Elapsed += new ElapsedEventHandler(DownloadFiles);
                t.Enabled = true;

                // Ensures the timer is not garbage collected
                GC.KeepAlive(t);

                // Allows our application to only last as long as it is needed
                while (index < matchIds.Count-1) ;
            }
        }

        private void DownloadFiles(object sender, ElapsedEventArgs e)
        {
            if (index < matchIds.Count-1)
            {
                try
                {
                    t.Stop();

                    // Dynamically creates the API path, and downloads the JSON String
                    var response = new WebClient().DownloadString(urlStart + matchIds[index] + urlEnd + yourAPI);
                    
                    // This is path where the file will save, including the filename
                    // Feel free to change this as you see fit
                    var path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "//MatchData//"
                            + (index + 1) + " - " + matchIds[index] + ".json";

                    // Create our file
                    FileStream fs = File.Create(path);

                    // Close our filestream so we can write the file
                    fs.Close();

                    // Write the file
                    File.WriteAllText(path, response);

                    // Increment index and provide a nice update message
                    index++;
                    Console.WriteLine("Finished file " + (index+1) + " of " + matchIds.Count);
                    t.Start();
                }
                catch (WebException)
                {
                    // On the off change you get a 429 response, it will restart the
                    // timer without incrementing the index, essentially retrying
                    // the same index after another 1200ms wait instead of breaking
                    t.Start();
                }

            }
            else
            {
                // Stop the timer in the case that we have finished.
                // Should be irrelevant because console should close
                // before it reaches this but safety first.
                t.Stop();
            }
        }
    }
}
