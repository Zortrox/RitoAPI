CREATE PROCEDURE [dbo].[up_PushTeam]
	@matchid bigint = 0, 
	@color varchar(10) = null,
	@winner bit = null,
	@baronKills int = null,
	@dragonKills int = null,
	@firstBaron bit = null,
	@firstBlood bit = null,
	@firstDragon bit = null,
	@firstInhib bit = null,
	@firstTower bit = null,
	@inhibKills int = null,
	@towerKills int = null
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO tbl_MatchData_Team
	(
		 [matchId]
		,[color]
		,[winner]
		,[baronKills]
		,[dragonKills]
		,[firstBaron]
		,[firstBlood]
		,[firstDragon]
		,[firstInhibitor]
		,[firstTower]
		,[inhibitorKills]
		,[towerKills]
	)
     VALUES
	( 
		 @matchid
		,@color
		,@winner
		,@baronKills
		,@dragonKills
		,@firstBaron
		,@firstBlood
		,@firstDragon
		,@firstInhib
		,@firstTower
		,@inhibKills
		,@towerKills
	)

END

