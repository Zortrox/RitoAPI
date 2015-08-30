CREATE FUNCTION [dbo].[fn_GetChampBanRate] 
(
	@championId bigint = null
)
RETURNS VARCHAR(10)
AS
BEGIN
	DECLARE @results VARCHAR(10)

	SELECT @results = CAST(100.0*x.bans/NULLIF(x.total,0) as numeric(36,2))
					FROM
					(
						SELECT 
							(
								select count(*)

								FROM tbl_MatchData match

									LEFT JOIN tbl_MatchData_Bans bans
										ON bans.matchId = match.matchId

								WHERE ban1 = @championId
									OR ban2 = @championId
									OR ban3 = @championId
									OR ban4 = @championId
									OR ban5 = @championId
									OR ban6 = @championId
							) as bans
							,(
								select count(*)

								FROM tbl_MatchData match
							) as total
					) as x

	RETURN COALESCE(@results, '0.00')
END


