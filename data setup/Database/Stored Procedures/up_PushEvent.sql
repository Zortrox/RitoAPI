CREATE PROCEDURE [dbo].[up_PushEvent]
	@matchId bigint = 0, 
	@killerId int = null,
	@participantId int = null,
	@player2Id int = null,
	@eventType varchar(50) = null,
	@itemId bigint = null,
	@buildingType varchar(50) = null,
	@laneType varchar(50) = null,
	@levelUpType varchar(50) = null,
	@monsterType varchar(50) = null,
	@skillSlot int = null,
	@buildingColor varchar(10) = null,
	@timestamp bigint = null,
	@towerType varchar(50) = null,
	@posX int = null,
	@posY int = null
	

AS
BEGIN
	SET NOCOUNT ON;

DECLARE @player1Id int

IF (@killerId > 0)
BEGIN
	SELECT @player1Id = playerId FROM tbl_MatchData_Player WHERE matchId=@matchId AND participantId=@killerId
END

IF (@participantId > 0)
BEGIN
	SELECT @player1Id = playerId FROM tbl_MatchData_Player WHERE matchId=@matchId AND participantId=@participantId
END

IF (@player2Id = 0)
BEGIN
	SET @player2Id = NULL
END
ELSE
BEGIN
	SELECT @player2Id = playerId FROM tbl_MatchData_Player WHERE matchId=@matchId AND participantId=@player2Id
END

INSERT INTO tbl_MatchData_Event
	(
	   [matchId]
      ,[playerId]
      ,[player2Id]
      ,[eventType]
	  ,[itemId]
      ,[buildingType]
      ,[laneType]
      ,[levelUpType]
      ,[monsterType]
      ,[skillSlot]
      ,[buildingColor]
      ,[timestamp]
      ,[towerType]
      ,[posx]
      ,[posy]

	)
     VALUES
	( 
		 @matchId
		,@player1Id
		,@player2Id
		,@eventType
		,@itemId
		,@buildingType
		,@laneType
		,@levelUpType
		,@monsterType
		,@skillSlot
		,@buildingColor
		,@timestamp
		,@towerType
		,@posX
		,@posY
	)

END


