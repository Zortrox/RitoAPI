using System.Collections.Generic;

namespace BDL.Objects
{
    public class TimeGraph
    {
        public TimeGraphSegment[] segments = new TimeGraphSegment[48];
    }

    public class TimeGraphSegment
    {
        public List<TimeGraphInfo> graphInfo = new List<TimeGraphInfo>();
    }

    public class TimeGraphInfo
    {
        public int championId;
        public string winRate;
        public string pickRate;
    }
}
