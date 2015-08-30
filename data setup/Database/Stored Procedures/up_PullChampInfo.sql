CREATE PROCEDURE [dbo].[up_PullChampInfo] 
AS
BEGIN
	SELECT
		champ.championId
		,dbo.fn_GetChampBanRate(champ.championId) as banRate
		,dbo.fn_GetChampPickRate(champ.championId, null) as pickRate
		,dbo.fn_GetChampWinWithItems(champ.championId) as winWithItems
		,dbo.fn_GetChampWinWithoutItems(champ.championId) as winWithoutItems
		,dbo.fn_GetChampBestItem(champ.championId) as bestItem
		,CAST(COALESCE(AVG(assists*1.0), 0) as numeric(36,2)) as AvgAssist
		,CAST(COALESCE(AVG(deaths*1.0), 0) as numeric(36,2)) as AvgDeaths
		,CAST(COALESCE(AVG(goldEarned*1.0), 0) as numeric(36,2)) as AvgGoldEarned
		,CAST(COALESCE(AVG(kills*1.0), 0) as numeric(36,2)) as AvgKills
		,CAST(COALESCE(AVG(minionsKilled*1.0), 0) as numeric(36,2)) as AvgMinionsKilled
		,CAST(COALESCE(AVG(towerKills*1.0), 0) as numeric(36,2)) as AvgTowerKills
		,CAST(COALESCE(AVG(wardsPlaced*1.0), 0) as numeric(36,2)) as AvgWardsPlaced
		,CAST(COALESCE(MAX(assists*1.0), 0) as numeric(36,2)) as MaxAssist
		,CAST(COALESCE(MAX(deaths*1.0), 0) as numeric(36,2)) as MaxDeaths
		,CAST(COALESCE(MAX(goldEarned*1.0), 0) as numeric(36,2)) as MaxGoldEarned
		,CAST(COALESCE(MAX(kills*1.0), 0) as numeric(36,2)) as MaxKills
		,CAST(COALESCE(MAX(minionsKilled*1.0), 0) as numeric(36,2)) as MaxMinionsKilled
		,CAST(COALESCE(MAX(towerKills*1.0), 0) as numeric(36,2)) as MaxTowerKills
		,CAST(COALESCE(MAX(wardsPlaced*1.0), 0) as numeric(36,2)) as MaxWardsPlaced

	FROM tbl_Static_Champions champ

		LEFT JOIN tbl_MatchData_Player player
			ON player.championId = champ.championId
		LEFT JOIN tbl_MatchData_PlayerStats pstats
			ON pstats.playerId = player.playerId

	GROUP BY champ.championid
	ORDER BY champ.championid
END
