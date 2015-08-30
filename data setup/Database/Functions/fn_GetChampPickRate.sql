CREATE FUNCTION [dbo].[fn_GetChampPickRate] 
(
	@championId bigint = null
	,@timeSlot int = null
)
RETURNS VARCHAR(10)
AS
BEGIN
	DECLARE @results VARCHAR(10)

	IF (@timeSlot IS NOT NULL)
	BEGIN
		SELECT @results = CAST(100.0*x.picks/NULLIF(x.total,0) as numeric(36,2))
							FROM
							(
								SELECT 
									(
										select count(*)

										FROM tbl_MatchData match

											LEFT JOIN tbl_MatchData_Player player
												ON player.matchId = match.matchId

										WHERE championId = @championId
											AND DATEDIFF(mi, CONVERT(VARCHAR(5), '00:00', 108), CONVERT(VARCHAR(5), dateadd(S, matchCreation/1000, '1970-01-01'), 108))/30 = @timeSlot
									) as picks
									,(
										select count(*)

										FROM tbl_MatchData match
										WHERE DATEDIFF(mi, CONVERT(VARCHAR(5), '00:00', 108), CONVERT(VARCHAR(5), dateadd(S, matchCreation/1000, '1970-01-01'), 108))/30 = @timeSlot
									) as total
							) as x
	END
	ELSE
	BEGIN
		SELECT @results = CAST(100.0*x.picks/NULLIF(x.total,0) as numeric(36,2))
						FROM
						(
							SELECT 
								(
									select count(*)

									FROM tbl_MatchData match

										LEFT JOIN tbl_MatchData_Player player
											ON player.matchId = match.matchId

									WHERE championId = @championId
								) as picks
								,(
									select count(*)

									FROM tbl_MatchData match
								) as total
						) as x
	END
	RETURN COALESCE(@results, '0.00')
END

