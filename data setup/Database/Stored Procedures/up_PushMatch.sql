CREATE PROCEDURE [dbo].[up_PushMatch] 
	@matchid bigint = 0, 
	@matchcreation bigint = 0,
	@matchduration bigint = 0,
	@region varchar(10) = null
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO tbl_MatchData
	(
		 [matchId]
		,[matchCreation]
		,[matchDuration]
		,[region]
	)
     VALUES
	( 
		 @matchid
		,@matchcreation
		,@matchduration
		,@region
	)

END


