CREATE PROCEDURE [dbo].[up_PushItemData] 
	@itemid	int				= 0, 
	@name	varchar(200)	= null
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO tbl_Static_Items
	(
		 [itemid]
		,[name]
	)
     VALUES
	( 
		 @itemid
		,@name
	)

END


