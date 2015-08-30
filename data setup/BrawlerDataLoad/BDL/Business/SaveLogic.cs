using System.IO;
using BDL.Objects;
using BDL.Data;
using Newtonsoft.Json;

namespace BDL.Business
{
    /// <summary>
    /// This class represents the business logic between the UI and Data layer required for saving data.
    /// </summary>
    class SaveLogic
    {
        public SaveLogic()
        {

        }

        public void SaveMatchData(string file)
        {
            using (StreamReader reader = new StreamReader(file))
            {
                string json = reader.ReadToEnd();
                MatchData match = JsonConvert.DeserializeObject<MatchData>(json);
                reader.Close();

                DataPush push = new DataPush(match);
                push.PushAll();
            }
        }

        public void SaveChampData()
        {
            ChampDataCollection champs = JsonConvert.DeserializeObject<ChampDataCollection>(Properties.Resources.ChampData);

            DataPush push = new DataPush();
            push.PushChampData(champs);
        }

        public void SaveItemData()
        {
            ItemDataCollection items = JsonConvert.DeserializeObject<ItemDataCollection>(Properties.Resources.ItemData);

            DataPush push = new DataPush();
            push.PushItemData(items);
        }

        public void SaveSumSpellData()
        {
            SumSpellDataCollection sums = JsonConvert.DeserializeObject<SumSpellDataCollection>(Properties.Resources.SumSpellData);

            DataPush push = new DataPush();
            push.PushSumSpellData(sums);
        }
    }
}
