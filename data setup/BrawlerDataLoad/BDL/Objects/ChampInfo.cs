using System.Collections.Generic;

namespace BDL.Objects
{
    public class ChampInfo
    {
        public List<Champ> info = new List<Champ>();
    }

    public class Champ
    {
        public int championId;
        public string banRate;
        public string pickRate;
        public string winWithItems;
        public string winWithoutItems;
        public string bestItem;
        public string AvgAssist;
        public string AvgDeaths;
        public string AvgGoldEarned;
        public string AvgKills;
        public string AvgMinionsKilled;
        public string AvgTowerKills;
        public string AvgWardsPlaced;
        public string MaxAssist;
        public string MaxDeaths;
        public string MaxGoldEarned;
        public string MaxKills;
        public string MaxMinionsKilled;
        public string MaxTowerKills;
        public string MaxWardsPlaced;
    }
}
