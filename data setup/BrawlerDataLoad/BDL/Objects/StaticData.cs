using System.Collections.Generic;

namespace BDL.Objects
{
    public class ChampDataCollection
    {
        public IDictionary<string, ChampData> data;
    }

    public class ChampData
    {
        public int id;
        public string name;
    }

    public class ItemDataCollection
    {
        public IDictionary<string, ItemData> data;
    }

    public class ItemData
    {
        public int id;
        public string name;
    }

    public class SumSpellDataCollection
    {
        public IDictionary<string, SumSpellData> data;
    }

    public class SumSpellData
    {
        public int id;
        public string name;
    }
}
