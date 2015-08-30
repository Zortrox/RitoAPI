CREATE PROCEDURE [dbo].[up_PushChampData] 
	@championId int			= 0, 
	@name		varchar(50)	= null
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO tbl_Static_Champions
	(
		 [championId]
		,[name]
	)
     VALUES
	( 
		 @championId
		,@name
	)

END


