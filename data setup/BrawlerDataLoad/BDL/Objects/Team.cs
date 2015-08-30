using System.Collections.Generic;

namespace BDL.Objects
{
    public class Team
    {
        public List<BannedChampion> bans;
        public int baronKills;
        //public long dominionVictoryScore;
        public int dragonKills;
        public bool firstBaron;
        public bool firstBlood;
        public bool firstDragon;
        public bool firstInhibitor;
        public bool firstTower;
        public int inhibitorKills;
        public int teamId;
        public int towerKills;
        //public int vilemawKills;
        public bool winner;
    }
}
