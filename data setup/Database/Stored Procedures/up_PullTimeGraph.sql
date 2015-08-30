CREATE PROCEDURE [dbo].[up_PullTimeGraph]
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @count INT = 0;
	DECLARE @data TABLE
	(
		timeSlot int
		,championId int
		,pickRate varchar(10)
		,winRate varchar(10)
	)

	WHILE @count < 48
	BEGIN
		INSERT INTO @data
			SELECT	 
				@count as timeSlot
				,championId
				,dbo.fn_GetChampPickRate(championId, @count) as pickRate
				,dbo.fn_GetChampWinRate(championId, @count) as winRate

			FROM tbl_Static_Champions
		SELECT @count = @count+1
	END

	SELECT * FROM @data
	ORDER BY timeslot, championid
END

GO


