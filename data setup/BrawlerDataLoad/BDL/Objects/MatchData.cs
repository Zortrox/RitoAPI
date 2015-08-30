using System.Collections.Generic;

namespace BDL.Objects
{
    public class MatchData
    {
        //public int mapId;
        public long matchCreation;
        public long matchDuration;
        public long matchId;
        //public string matchMode;
        //public string matchType;
        //public string matchVersion;
        //public List<ParticipantIdentity> participantIdentities;
        public List<Participant> participants;
        //public string platformId;
        //public string queueType;
        public string region;
        //public string season;
        public List<Team> teams;
        public Timeline timeline;
    }
}
