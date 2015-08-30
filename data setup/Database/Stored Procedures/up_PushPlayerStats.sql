CREATE PROCEDURE [dbo].[up_PushPlayerStats]
	@matchId bigint = 0, 
	@participantId int = null,
	@assists bigint = null,
	@champLevel bigint = null,
	@deaths bigint = null,
	@doublekills bigint = null,
	@firstBloodAssist bit = null,
	@firstBloodKill bit = null,
	@firstInhibAssist bit = null,
	@firstInhibKill bit = null,
	@firstTowerAssist bit = null,
	@firstTowerKill bit = null,
	@goldEarned bigint = null,
	@goldSpent bigint = null,
	@inhibKills bigint = null,
	@item0 bigint = null,
	@item1 bigint = null,
	@item2 bigint = null,
	@item3 bigint = null,
	@item4 bigint = null,
	@item5 bigint = null,
	@item6 bigint = null,
	@killingSprees bigint = null,
	@kills bigint = null,
	@largestCrit bigint = null,
	@largestKillingSpree bigint = null,
	@largestMultiKill bigint = null,
	@magicDamageDealt bigint = null,
	@magicDamageDealtToChamps bigint = null,
	@magicDamageTaken bigint = null,
	@minionsKilled bigint = null,
	@neutralMinionsKilled bigint = null,
	@neutralMinionsKilledEnemyJungle bigint = null,
	@neutralMinionsKilledTeamJungle bigint = null,
	@pentaKills bigint = null,
	@physicalDamageDealt bigint = null,
	@physicalDamageDealtToChamps bigint = null,
	@physicalDamageTaken bigint = null,
	@quadraKills bigint = null,
	@sightWardsBought bigint = null,
	@totalDamageDealt bigint = null,
	@totalDamageDealtToChamps bigint = null,
	@totalDamageTaken bigint = null,
	@totalHeal bigint = null,
	@totalTimeCrowdControlDealt bigint = null,
	@totalUnitsHealed bigint = null,
	@tripleKills bigint = null,
	@trueDamageDealt bigint = null,
	@trueDamageDealtToChamps bigint = null,
	@trueDamageTaken bigint = null,
	@unrealKills bigint = null,
	@visionWardsBought bigint = null,
	@wardsKilled bigint = null,
	@wardsPlaced bigint = null,
	@winner bit = null

AS
BEGIN
	SET NOCOUNT ON;

IF (@item0 = 0)
BEGIN
	SET @item0 = null
END

IF (@item1 = 0)
BEGIN
	SET @item1 = null
END

IF (@item2 = 0)
BEGIN
	SET @item2 = null
END

IF (@item3 = 0)
BEGIN
	SET @item3 = null
END

IF (@item4 = 0)
BEGIN
	SET @item4 = null
END

IF (@item5 = 0)
BEGIN
	SET @item5 = null
END

IF (@item6 = 0)
BEGIN
	SET @item6 = null
END

INSERT INTO tbl_MatchData_PlayerStats
	(
       [playerId]
      ,[assists]
      ,[champLevel]
      ,[deaths]
      ,[doubleKills]
      ,[firstBloodAssist]
      ,[firstBloodKill]
      ,[firstInhibitorAssist]
      ,[firstInhibitorKill]
      ,[firstTowerAssist]
      ,[firstTowerKill]
      ,[goldEarned]
      ,[goldSpent]
      ,[inhibitorKils]
      ,[item0]
      ,[item1]
      ,[item2]
      ,[item3]
      ,[item4]
      ,[item5]
      ,[item6]
      ,[killingSprees]
      ,[kills]
      ,[largestCriticalStrike]
      ,[largestKillingSpree]
      ,[largestMultikill]
      ,[magicDamageDealt]
      ,[magicDamageDealtToChampions]
      ,[magicDamageTaken]
      ,[minionsKilled]
      ,[neutralMinionsKilled]
      ,[neutralMinionsKilledEnemyJungle]
      ,[neutralMinionsKilledTeamJungle]
      ,[pentaKills]
      ,[physicalDamageDealt]
      ,[physicalDamageDealtToChampions]
      ,[physicalDamageTaken]
      ,[quadraKills]
      ,[sightWardsBoughtInGame]
      ,[totalDamageDealt]
      ,[totalDamageDealtToChampions]
      ,[totalDamageTaken]
      ,[totalHeal]
      ,[totalTimeCrowdControlDealt]
      ,[totalUnitsHealed]
      ,[towerKills]
      ,[tripleKills]
      ,[trueDamageDealt]
      ,[trueDamageDealtToChampions]
      ,[trueDamageTaken]
      ,[unrealKills]
      ,[visionWardsBoughtInGame]
      ,[wardsKilled]
      ,[wardsPlaced]
      ,[winner]
	)
     VALUES
	( 
		 (SELECT playerId FROM tbl_MatchData_Player WHERE matchId=@matchId AND participantId=@participantId)
		,@assists
		,@champLevel
		,@deaths
		,@doublekills
		,@firstBloodAssist
		,@firstBloodKill
		,@firstInhibAssist
		,@firstInhibKill
		,@firstTowerAssist
		,@firstTowerKill
		,@goldEarned
		,@goldEarned
		,@inhibKills
		,@item0
		,@item1
		,@item2
		,@item3
		,@item4
		,@item5
		,@item6
		,@killingSprees
		,@kills
		,@largestCrit
		,@largestKillingSpree
		,@largestMultiKill
		,@magicDamageDealt
		,@magicDamageDealtToChamps
		,@magicDamageTaken
		,@minionsKilled
		,@neutralMinionsKilled
		,@neutralMinionsKilledEnemyJungle
		,@neutralMinionsKilledTeamJungle
		,@pentaKills
		,@physicalDamageDealt
		,@physicalDamageDealtToChamps
		,@physicalDamageTaken
		,@quadraKills
		,@sightWardsBought
		,@totalDamageDealt
		,@totalDamageDealtToChamps
		,@totalDamageTaken
		,@totalHeal
		,@totalTimeCrowdControlDealt
		,@totalTimeCrowdControlDealt
		,@totalUnitsHealed
		,@tripleKills
		,@trueDamageDealt
		,@trueDamageDealtToChamps
		,@trueDamageTaken
		,@unrealKills
		,@visionWardsBought
		,@wardsKilled
		,@wardsPlaced
		,@winner
	)

END

