using BDL.Objects;
using System.Data.SqlClient;
using System.Data;
using System.Transactions;

namespace BDL.Data
{
    /// <summary>
    /// Allows adding data to the database
    /// </summary>
    class DataPush
    {
        private MatchData m_Match;
        private const string CONNECTION_STRING = "Data Source=(local)\\LocalDB;Initial Catalog=MuchBrawlers;Integrated Security=True;Max Pool Size=200";

        public DataPush()
        {

        }

        public DataPush(MatchData match)
        {
            m_Match = match;
        }

        public void PushAll()
        {
            try
            {
                using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = System.Transactions.IsolationLevel.ReadUncommitted }))
                {
                    // Creating a single connection for each match
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();

                        if (MatchExists(con))
                            return;

                        PushMatch(con);
                        PushBans(con);
                        PushTeam(con);
                        PushPlayer(con);
                        PushPlayerStats(con);
                        PushEvent(con);
                    }
                    SqlConnection.ClearAllPools();
                    scope.Complete();
                }
            }
            catch (TransactionException)
            {
                return;
            }
        }

        private bool MatchExists(SqlConnection con)
        {
            string sp = "SELECT COUNT(*) FROM tbl_MatchData WHERE matchId="+m_Match.matchId;

            using (SqlCommand cmd = new SqlCommand(sp, con))
            {
                cmd.CommandType = CommandType.Text;

                DataSet ds = new DataSet();
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = cmd;
                da.Fill(ds);

                if ((int)ds.Tables[0].Rows[0][0] < 1)
                    return false;
                else
                    return true;
            }
        }

        private void PushMatch(SqlConnection con)
        {
            string sp = "up_PushMatch";

            using (SqlCommand cmd = new SqlCommand(sp, con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@matchId", SqlDbType.BigInt).Value = m_Match.matchId;
                cmd.Parameters.Add("@matchCreation", SqlDbType.BigInt).Value = m_Match.matchCreation;
                cmd.Parameters.Add("@matchDuration", SqlDbType.BigInt).Value = m_Match.matchDuration;
                cmd.Parameters.Add("@region", SqlDbType.VarChar).Value = m_Match.region;

                cmd.ExecuteNonQuery();
            }
        }

        private void PushBans(SqlConnection con)
        {
            string sp = "up_PushBans";

            using (SqlCommand cmd = new SqlCommand(sp, con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@matchId", SqlDbType.BigInt).Value = m_Match.matchId;

                if (m_Match.teams[0].bans != null)
                {
                    foreach (BannedChampion ban in m_Match.teams[0].bans)
                    {
                        if (ban.pickTurn == 1)
                        {
                            cmd.Parameters.Add("@ban1", SqlDbType.Int).Value = ban.championId;
                        }
                        if (ban.pickTurn == 3)
                        {
                            cmd.Parameters.Add("@ban3", SqlDbType.Int).Value = ban.championId;
                        }
                        if (ban.pickTurn == 5)
                        {
                            cmd.Parameters.Add("@ban5", SqlDbType.Int).Value = ban.championId;
                        }
                    }
                }

                if (m_Match.teams[1].bans != null)
                {
                    foreach (BannedChampion ban in m_Match.teams[1].bans)
                    {
                        if (ban.pickTurn == 2)
                        {
                            cmd.Parameters.Add("@ban2", SqlDbType.Int).Value = ban.championId;
                        }
                        if (ban.pickTurn == 4)
                        {
                            cmd.Parameters.Add("@ban4", SqlDbType.Int).Value = ban.championId;
                        }
                        if (ban.pickTurn == 6)
                        {
                            cmd.Parameters.Add("@ban6", SqlDbType.Int).Value = ban.championId;
                        }
                    }
                }
                cmd.ExecuteNonQuery();
            }
        }

        private void PushTeam(SqlConnection con)
        {
            string sp = "up_PushTeam";

            Team[] teams = m_Match.teams.ToArray();

            for (int i = 0; i < m_Match.teams.Count; i++)
            {
                using (SqlCommand cmd = new SqlCommand(sp, con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@matchId", SqlDbType.BigInt).Value = m_Match.matchId;
                    cmd.Parameters.Add("@color", SqlDbType.VarChar).Value = (teams[i].teamId == 100 ? "blue" : "red");
                    cmd.Parameters.Add("@winner", SqlDbType.Bit).Value = teams[i].winner;
                    cmd.Parameters.Add("@baronKills", SqlDbType.Int).Value = teams[i].baronKills;
                    cmd.Parameters.Add("@dragonKills", SqlDbType.Int).Value = teams[i].dragonKills;
                    cmd.Parameters.Add("@firstBaron", SqlDbType.Bit).Value = teams[i].firstBaron;
                    cmd.Parameters.Add("@firstBlood", SqlDbType.Bit).Value = teams[i].firstBlood;
                    cmd.Parameters.Add("@firstDragon", SqlDbType.Bit).Value = teams[i].firstDragon;
                    cmd.Parameters.Add("@firstInhib", SqlDbType.Bit).Value = teams[i].firstInhibitor;
                    cmd.Parameters.Add("@firstTower", SqlDbType.Bit).Value = teams[i].firstTower;
                    cmd.Parameters.Add("@inhibKills", SqlDbType.Int).Value = teams[i].inhibitorKills;
                    cmd.Parameters.Add("@towerKills", SqlDbType.Int).Value = teams[i].towerKills;

                    cmd.ExecuteNonQuery();
                }
            }
        }

        private void PushPlayer(SqlConnection con)
        {
            string sp = "up_PushPlayer";

            Participant[] participants = m_Match.participants.ToArray();

            for (int i=0; i < participants.Length; i++)
            {
                using (SqlCommand cmd = new SqlCommand(sp, con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@matchId", SqlDbType.BigInt).Value = m_Match.matchId;
                    cmd.Parameters.Add("@participantId", SqlDbType.Int).Value = participants[i].participantId;
                    cmd.Parameters.Add("@championId", SqlDbType.Int).Value = participants[i].championId;
                    cmd.Parameters.Add("@spell1", SqlDbType.Int).Value = participants[i].spell1Id;
                    cmd.Parameters.Add("@spell2", SqlDbType.Int).Value = participants[i].spell2Id;
                    if (participants[i].teamId != 0)
                        cmd.Parameters.Add("@color", SqlDbType.VarChar).Value = (participants[i].teamId == 100 ? "blue" : "red");

                    cmd.ExecuteNonQuery();
                }
            }
        }

        private void PushPlayerStats(SqlConnection con)
        {
            string sp = "up_PushPlayerStats";

            Participant[] participants = m_Match.participants.ToArray();

            for (int i=0; i< participants.Length; i++)
            {
                using (SqlCommand cmd = new SqlCommand(sp, con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@matchId", SqlDbType.BigInt).Value = m_Match.matchId;
                    cmd.Parameters.Add("@participantId", SqlDbType.Int).Value = participants[i].participantId;
                    cmd.Parameters.Add("@assists", SqlDbType.BigInt).Value = participants[i].stats.assists;
                    cmd.Parameters.Add("@champLevel", SqlDbType.BigInt).Value = participants[i].stats.champLevel;
                    cmd.Parameters.Add("@deaths", SqlDbType.BigInt).Value = participants[i].stats.deaths;
                    cmd.Parameters.Add("@doubleKills", SqlDbType.BigInt).Value = participants[i].stats.doubleKills;
                    cmd.Parameters.Add("@firstBloodAssist", SqlDbType.BigInt).Value = participants[i].stats.firstBloodAssist;
                    cmd.Parameters.Add("@firstBloodKill", SqlDbType.BigInt).Value = participants[i].stats.firstBloodKill;
                    cmd.Parameters.Add("@firstInhibAssist", SqlDbType.BigInt).Value = participants[i].stats.firstInhibitorAssist;
                    cmd.Parameters.Add("@firstInhibKill", SqlDbType.BigInt).Value = participants[i].stats.firstInhibitorKill;
                    cmd.Parameters.Add("@firstTowerAssist", SqlDbType.BigInt).Value = participants[i].stats.firstTowerAssist;
                    cmd.Parameters.Add("@firstTowerKill", SqlDbType.BigInt).Value = participants[i].stats.firstTowerKill;
                    cmd.Parameters.Add("@goldEarned", SqlDbType.BigInt).Value = participants[i].stats.goldEarned;
                    cmd.Parameters.Add("@goldSpent", SqlDbType.BigInt).Value = participants[i].stats.goldSpent;
                    cmd.Parameters.Add("@inhibKills", SqlDbType.BigInt).Value = participants[i].stats.inhibitorKills;
                    cmd.Parameters.Add("@item0", SqlDbType.BigInt).Value = participants[i].stats.item0;
                    cmd.Parameters.Add("@item1", SqlDbType.BigInt).Value = participants[i].stats.item1;
                    cmd.Parameters.Add("@item2", SqlDbType.BigInt).Value = participants[i].stats.item2;
                    cmd.Parameters.Add("@item3", SqlDbType.BigInt).Value = participants[i].stats.item3;
                    cmd.Parameters.Add("@item4", SqlDbType.BigInt).Value = participants[i].stats.item4;
                    cmd.Parameters.Add("@item5", SqlDbType.BigInt).Value = participants[i].stats.item5;
                    cmd.Parameters.Add("@item6", SqlDbType.BigInt).Value = participants[i].stats.item6;
                    cmd.Parameters.Add("@killingSprees", SqlDbType.BigInt).Value = participants[i].stats.killingSprees;
                    cmd.Parameters.Add("@kills", SqlDbType.BigInt).Value = participants[i].stats.kills;
                    cmd.Parameters.Add("@largestCrit", SqlDbType.BigInt).Value = participants[i].stats.largestCriticalStrike;
                    cmd.Parameters.Add("@largestKillingSpree", SqlDbType.BigInt).Value = participants[i].stats.largestKillingSpree;
                    cmd.Parameters.Add("@largestMultikill", SqlDbType.BigInt).Value = participants[i].stats.largestMultikill;
                    cmd.Parameters.Add("@magicDamageDealt", SqlDbType.BigInt).Value = participants[i].stats.magicDamageDealt;
                    cmd.Parameters.Add("@magicDamageDealtToChamps", SqlDbType.BigInt).Value = participants[i].stats.magicDamageDealtToChampions;
                    cmd.Parameters.Add("@magicDamageTaken", SqlDbType.BigInt).Value = participants[i].stats.magicDamageTaken;
                    cmd.Parameters.Add("@minionsKilled", SqlDbType.BigInt).Value = participants[i].stats.minionsKilled;
                    cmd.Parameters.Add("@neutralMinionsKilled", SqlDbType.BigInt).Value = participants[i].stats.neutralMinionsKilled;
                    cmd.Parameters.Add("@neutralMinionsKilledEnemyJungle", SqlDbType.BigInt).Value = participants[i].stats.neutralMinionsKilledEnemyJungle;
                    cmd.Parameters.Add("@neutralMinionsKilledTeamJungle", SqlDbType.BigInt).Value = participants[i].stats.neutralMinionsKilledTeamJungle;
                    cmd.Parameters.Add("@pentaKills", SqlDbType.BigInt).Value = participants[i].stats.pentaKills;
                    cmd.Parameters.Add("@physicalDamageDealt", SqlDbType.BigInt).Value = participants[i].stats.physicalDamageDealt;
                    cmd.Parameters.Add("@physicalDamageDealtToChamps", SqlDbType.BigInt).Value = participants[i].stats.physicalDamageDealtToChampions;
                    cmd.Parameters.Add("@physicalDamageTaken", SqlDbType.BigInt).Value = participants[i].stats.physicalDamageTaken;
                    cmd.Parameters.Add("@quadraKills", SqlDbType.BigInt).Value = participants[i].stats.quadraKills;
                    cmd.Parameters.Add("@sightWardsBought", SqlDbType.BigInt).Value = participants[i].stats.sightWardsBoughtInGame;
                    cmd.Parameters.Add("@totalDamageDealt", SqlDbType.BigInt).Value = participants[i].stats.totalDamageDealt;
                    cmd.Parameters.Add("@totalDamageDealtToChamps", SqlDbType.BigInt).Value = participants[i].stats.totalDamageDealtToChampions;
                    cmd.Parameters.Add("@totalDamageTaken", SqlDbType.BigInt).Value = participants[i].stats.totalDamageTaken;
                    cmd.Parameters.Add("@totalHeal", SqlDbType.BigInt).Value = participants[i].stats.totalHeal;
                    cmd.Parameters.Add("@totalTimeCrowdControlDealt", SqlDbType.BigInt).Value = participants[i].stats.totalTimeCrowdControlDealt;
                    cmd.Parameters.Add("@totalUnitsHealed", SqlDbType.BigInt).Value = participants[i].stats.totalUnitsHealed;
                    cmd.Parameters.Add("@tripleKills", SqlDbType.BigInt).Value = participants[i].stats.tripleKills;
                    cmd.Parameters.Add("@trueDamageDealt", SqlDbType.BigInt).Value = participants[i].stats.trueDamageDealt;
                    cmd.Parameters.Add("@trueDamageDealtToChamps", SqlDbType.BigInt).Value = participants[i].stats.trueDamageDealtToChampions;
                    cmd.Parameters.Add("@trueDamageTaken", SqlDbType.BigInt).Value = participants[i].stats.trueDamageTaken;
                    cmd.Parameters.Add("@unrealKills", SqlDbType.BigInt).Value = participants[i].stats.unrealKills;
                    cmd.Parameters.Add("@visionWardsBought", SqlDbType.BigInt).Value = participants[i].stats.visionWardsBoughtInGame;
                    cmd.Parameters.Add("@wardsKilled", SqlDbType.BigInt).Value = participants[i].stats.wardsKilled;
                    cmd.Parameters.Add("@wardsPlaced", SqlDbType.BigInt).Value = participants[i].stats.wardsPlaced;
                    cmd.Parameters.Add("@winner", SqlDbType.Bit).Value = participants[i].stats.winner;

                    cmd.ExecuteNonQuery();
                }
            }
        }

        private void PushEvent(SqlConnection con)
        {
            string sp = "up_PushEvent";

            Frame[] frames = m_Match.timeline.frames.ToArray();
            
            for (int i=0; i < frames.Length; i++)
            {
                if (frames[i].events != null)
                {
                    Event[] events = frames[i].events.ToArray();
                    for (int j=0; j< events.Length; j++)
                    {
                        if (events[j].eventType == "ITEM_PURCHASED"   || events[j].eventType == "CHAMPION_KILL" 
                            || events[j].eventType == "BUILDING_KILL" || events[j].eventType == "ELITE_MONSTER_KILL")
                        {
                            using (SqlCommand cmd = new SqlCommand(sp, con))
                            {
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.Add("@matchId", SqlDbType.BigInt).Value = m_Match.matchId;
                                cmd.Parameters.Add("@killerId", SqlDbType.Int).Value = events[j].killerId;
                                cmd.Parameters.Add("@participantId", SqlDbType.Int).Value = events[j].participantId;
                                cmd.Parameters.Add("@player2Id", SqlDbType.Int).Value = events[j].victimId;
                                cmd.Parameters.Add("@eventType", SqlDbType.VarChar).Value = events[j].eventType;
                                if (events[j].itemId != 0)
                                    cmd.Parameters.Add("@itemId", SqlDbType.BigInt).Value = events[j].itemId;
                                cmd.Parameters.Add("@buildingType", SqlDbType.VarChar).Value = events[j].buildingType;
                                cmd.Parameters.Add("@laneType", SqlDbType.VarChar).Value = events[j].laneType;
                                cmd.Parameters.Add("@levelUpType", SqlDbType.VarChar).Value = events[j].levelUpType;
                                cmd.Parameters.Add("@monsterType", SqlDbType.VarChar).Value = events[j].monsterType;
                                cmd.Parameters.Add("@skillSlot", SqlDbType.Int).Value = events[j].skillSlot;
                                if (events[j].teamId != 0)
                                    cmd.Parameters.Add("@buildingColor", SqlDbType.VarChar).Value = (events[j].teamId == 100 ? "blue" : "red");
                                cmd.Parameters.Add("@timestamp", SqlDbType.BigInt).Value = events[j].timestamp;
                                cmd.Parameters.Add("@towerType", SqlDbType.VarChar).Value = events[j].towerType;
                                if (events[j].position != null)
                                {
                                    cmd.Parameters.Add("@posX", SqlDbType.Int).Value = events[j].position.x;
                                    cmd.Parameters.Add("@posY", SqlDbType.Int).Value = events[j].position.y;
                                }

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }
            }
        }

        public void PushChampData(ChampDataCollection col)
        {
            string sp = "up_PushChampData";

            foreach (ChampData champ in col.data.Values)
            {
                using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                {
                    using (SqlCommand cmd = new SqlCommand(sp, con))
                    {
                        try
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.Add("@championId", SqlDbType.Int).Value = champ.id;
                            cmd.Parameters.Add("@name", SqlDbType.VarChar).Value = champ.name;

                            con.Open();
                            cmd.ExecuteNonQuery();
                        }
                        finally
                        {
                            con.Close();
                        }
                    }
                }
            }
        }

        public void PushItemData(ItemDataCollection col)
        {
            string sp = "up_PushItemData";

            foreach (ItemData item in col.data.Values)
            {
                using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                {
                    using (SqlCommand cmd = new SqlCommand(sp, con))
                    {
                        try
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.Add("@itemid", SqlDbType.Int).Value = item.id;
                            cmd.Parameters.Add("@name", SqlDbType.VarChar).Value = item.name;

                            con.Open();
                            cmd.ExecuteNonQuery();
                        }
                        finally
                        {
                            con.Close();
                        }
                    }
                }
            }
        }

        public void PushSumSpellData(SumSpellDataCollection col)
        {
            string sp = "up_PushSumSpellData";

            foreach (SumSpellData sum in col.data.Values)
            {
                using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                {
                    using (SqlCommand cmd = new SqlCommand(sp, con))
                    {
                        try
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.Add("@sumid", SqlDbType.Int).Value = sum.id;
                            cmd.Parameters.Add("@name", SqlDbType.VarChar).Value = sum.name;

                            con.Open();
                            cmd.ExecuteNonQuery();
                        }
                        finally
                        {
                            con.Close();
                        }
                    }
                }
            }
        }
    }
}
