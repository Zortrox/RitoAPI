CREATE PROCEDURE [dbo].[up_PushSumSpellData] 
	@sumid	int			= 0, 
	@name	varchar(50)	= null
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO tbl_Static_SummonerSpells
	(
		 [summonerSpellId]
		,[name]
	)
     VALUES
	( 
		 @sumid
		,@name
	)

END

