CREATE FUNCTION [dbo].[fn_GetChampWinWithItems]
(
	@championId int = null
)
RETURNS VARCHAR(10)
AS
BEGIN
	DECLARE @results VARCHAR(10)

	SELECT @results = CAST(100.0*x.wins/NULLIF(x.total,0) as numeric(36,2))
						FROM
						(
							SELECT 
								(
									SELECT count(distinct player.playerId) 
									FROM tbl_MatchData match

										LEFT JOIN tbl_MatchData_Player player
											ON player.matchId = match.matchId

										LEFT JOIN tbl_MatchData_Team team
											ON team.matchId = match.matchId
											AND team.teamId = player.teamId

									WHERE championId = @championId
										AND winner = 1
										AND (	SELECT count(*) 
												FROM tbl_MatchData_Event 
												WHERE playerId = player.playerId 
													AND itemId IN (	3742, 3430, 3911, 3744, 1335, 1336, 1337, 
																	1338, 1339, 1340, 1341, 3924, 3829, 3433,
																	3652, 3150, 3844, 3431, 3434, 3841, 3840, 3745)) > 0
								) as wins
								,(
									select count(*)

									FROM tbl_MatchData match

										LEFT JOIN tbl_MatchData_Player player
											ON player.matchId = match.matchId

									WHERE championId = @championId
								) as total
						) as x		

	RETURN COALESCE(@results, '0.00')

END


