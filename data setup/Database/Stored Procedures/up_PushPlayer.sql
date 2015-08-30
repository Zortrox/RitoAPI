CREATE PROCEDURE [dbo].[up_PushPlayer]
	@matchId bigint = 0, 
	@participantId int = null,
	@championId int = null,
	@spell1 int = null,
	@spell2 int = null,
	@color varchar(10) = null
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO tbl_MatchData_Player
	(
		 [matchId]
		,[participantId]
		,[championId]
		,[spell1Id]
		,[spell2Id]
		,[teamid]
	)
     VALUES
	( 
		 @matchId
		,@participantId
		,@championId
		,@spell1
		,@spell2
		,(SELECT teamId FROM tbl_MatchData_Team WHERE matchId=@matchId AND color=@color)
	)

END


