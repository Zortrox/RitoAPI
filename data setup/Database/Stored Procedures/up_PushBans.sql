CREATE PROCEDURE [dbo].[up_PushBans]
	@matchid bigint = 0, 
	@ban1 int = null,
	@ban2 int = null,
	@ban3 int = null,
	@ban4 int = null,
	@ban5 int = null,
	@ban6 int = null
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO tbl_MatchData_Bans
	(
		 [matchId]
		,[ban1]
		,[ban2]
		,[ban3]
		,[ban4]
		,[ban5]
		,[ban6]
	)
     VALUES
	( 
		 @matchid
		,@ban1
		,@ban2
		,@ban3
		,@ban4
		,@ban5
		,@ban6
	)

END


