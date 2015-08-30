CREATE PROCEDURE [dbo].[up_PullBrawlerStats] 
AS
BEGIN
	SELECT 

		CAST(ROUND(100.0*x.[3611games]/NULLIF(x.total,0), 2) as numeric(36,2)) as [3611pickrate]
		,CAST(ROUND(100.0*x.[3612wins]/NULLIF(x.total,0), 2) as numeric(36,2)) as [3612pickrate]
		,CAST(ROUND(100.0*x.[3613wins]/NULLIF(x.total,0), 2) as numeric(36,2)) as [3613pickrate]
		,CAST(ROUND(100.0*x.[3614wins]/NULLIF(x.total,0), 2) as numeric(36,2)) as [3614pickrate]
		,CAST(ROUND(100.0*x.[nonegames]/NULLIF(x.total,0), 2) as numeric(36,2)) as [nonepickrate]
		,CAST(ROUND(100.0*x.[3611wins]/NULLIF(x.[3611games],0), 2) as numeric(36,2)) as [3611winrate]
		,CAST(ROUND(100.0*x.[3612wins]/NULLIF(x.[3612games],0), 2) as numeric(36,2)) as [3612winrate]
		,CAST(ROUND(100.0*x.[3613wins]/NULLIF(x.[3613games],0), 2) as numeric(36,2)) as [3613winrate]
		,CAST(ROUND(100.0*x.[3614wins]/NULLIF(x.[3614games],0), 2) as numeric(36,2)) as [3614winrate]
		,CAST(ROUND(100.0*x.[nonewins]/NULLIF(x.[nonegames],0), 2) as numeric(36,2)) as [nonewinrate]

	FROM 
	(
		SELECT 
		(
			SELECT count(*)
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Team team
					ON team.matchId = player.matchId
					AND team.teamId = player.teamId
				LEFT JOIN tbl_MatchData_Event ev
					ON ev.playerId = player.playerId

			WHERE eventType = 'ITEM_PURCHASED'
				AND itemID = 3611
				AND winner = 1
		) as [3611wins]
		,(
			SELECT count(*)
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Event ev
					ON ev.playerId = player.playerId

			WHERE eventType = 'ITEM_PURCHASED'
				AND itemID = 3611
		) as [3611games]
		,(
			SELECT count(*)
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Team team
					ON team.matchId = player.matchId
					AND team.teamId = player.teamId
				LEFT JOIN tbl_MatchData_Event ev
					ON ev.playerId = player.playerId

			WHERE eventType = 'ITEM_PURCHASED'
				AND itemID = 3612
				AND winner = 1
		) as [3612wins]
		,(
			SELECT count(*)
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Event ev
					ON ev.playerId = player.playerId

			WHERE eventType = 'ITEM_PURCHASED'
				AND itemID = 3612
		) as [3612games]
		,(
			SELECT count(*)
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Team team
					ON team.matchId = player.matchId
					AND team.teamId = player.teamId
				LEFT JOIN tbl_MatchData_Event ev
					ON ev.playerId = player.playerId

			WHERE eventType = 'ITEM_PURCHASED'
				AND itemID = 3613
				AND winner = 1
		) as [3613wins]
		,(
			SELECT count(*)
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Event ev
					ON ev.playerId = player.playerId

			WHERE eventType = 'ITEM_PURCHASED'
				AND itemID = 3613
		) as [3613games]
		,(
			SELECT count(*)
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Team team
					ON team.matchId = player.matchId
					AND team.teamId = player.teamId
				LEFT JOIN tbl_MatchData_Event ev
					ON ev.playerId = player.playerId

			WHERE eventType = 'ITEM_PURCHASED'
				AND itemID = 3614
				AND winner = 1
		) as [3614wins]
		,(
			SELECT count(*)
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Event ev
					ON ev.playerId = player.playerId

			WHERE eventType = 'ITEM_PURCHASED'
				AND itemID = 3614
		) as [3614games]
		,(
			SELECT count(*) 
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Team team
					ON team.matchId = player.matchId
					AND team.teamId = player.teamId
			WHERE (SELECT top 1 itemid FROM tbl_MatchData_Event WHERE itemid IN (3611, 3612, 3613, 3614) AND playerid=player.playerId) IS NULL
				AND winner = 1
		) as [nonewins]
		,(
			SELECT count(*) 
			FROM tbl_MatchData_Player player
				LEFT JOIN tbl_MatchData_Team team
					ON team.matchId = player.matchId
					AND team.teamId = player.teamId
			WHERE (SELECT top 1 itemid FROM tbl_MatchData_Event WHERE itemid IN (3611, 3612, 3613, 3614) AND playerid=player.playerId) IS NULL
		) as [nonegames]
		,(
			SELECT count(*)
			FROM tbl_MatchData_Player player
		) as [total]
	) as x
END


