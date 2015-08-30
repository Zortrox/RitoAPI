using System;
using System.Data;
using System.IO;
using Newtonsoft.Json;
using BDL.Data;
using BDL.Objects;

namespace BDL.Business
{
    /// <summary>
    /// This class represents the business logic between the UI and Data layer required for loading and formatting data.
    /// </summary>
    class LoadLogic
    {
        public LoadLogic()
        {

        }

        public void LoadTimeGraph()
        {
            DataPull pull = new DataPull();
            DataView dv = new DataView();
            TimeGraph tg = new TimeGraph();

            dv = pull.PullTimeGraph();

            foreach (DataRowView row in dv)
            {
                if (row["timeSlot"].ToString() != string.Empty)
                {
                    int timeSlot = int.Parse(row["timeSlot"].ToString());
                    TimeGraphInfo info = new TimeGraphInfo();

                    info.championId = int.Parse(row["championId"].ToString());
                    info.pickRate = row["pickRate"].ToString();
                    info.winRate = row["winRate"].ToString();

                    if (tg.segments[timeSlot] == null)
                        tg.segments[timeSlot] = new TimeGraphSegment();
                    tg.segments[timeSlot].graphInfo.Add(info);
                }
            }

            string json = JsonConvert.SerializeObject(tg);
            var path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "//RitoOutput//TimeGraph.json";
            File.WriteAllText(path, json);
        }

        public void LoadChampInfo()
        {
            DataPull pull = new DataPull();
            DataView dv = new DataView();
            ChampInfo ci = new ChampInfo();

            dv = pull.PullChampInfo();

            foreach (DataRowView row in dv)
            {
                Champ cha = new Champ();

                cha.championId = int.Parse(row["championId"].ToString());
                cha.banRate = row["banRate"].ToString();
                cha.pickRate = row["pickRate"].ToString();
                cha.winWithItems = row["winWithItems"].ToString();
                cha.winWithoutItems = row["winWithoutItems"].ToString();
                cha.bestItem = row["bestItem"].ToString();
                cha.AvgAssist = row["AvgAssist"].ToString();
                cha.AvgDeaths = row["AvgDeaths"].ToString();
                cha.AvgGoldEarned = row["AvgGoldEarned"].ToString();
                cha.AvgKills = row["AvgKills"].ToString();
                cha.AvgMinionsKilled = row["AvgMinionsKilled"].ToString();
                cha.AvgTowerKills = row["AvgTowerKills"].ToString();
                cha.AvgWardsPlaced = row["AvgWardsPlaced"].ToString();
                cha.MaxAssist = row["MaxAssist"].ToString();
                cha.MaxDeaths = row["MaxDeaths"].ToString();
                cha.MaxGoldEarned = row["MaxGoldEarned"].ToString();
                cha.MaxKills = row["MaxKills"].ToString();
                cha.MaxMinionsKilled = row["MaxMinionsKilled"].ToString();
                cha.MaxTowerKills = row["MaxTowerKills"].ToString();
                cha.MaxWardsPlaced = row["MaxWardsPlaced"].ToString();

                ci.info.Add(cha);
            }

            string json = JsonConvert.SerializeObject(ci);
            var path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "//RitoOutput//ChampInfo.json";
            File.WriteAllText(path, json);
        }
    }
}
