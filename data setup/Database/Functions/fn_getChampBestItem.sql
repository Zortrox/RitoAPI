CREATE FUNCTION [dbo].[fn_GetChampBestItem]
(
	@championId int = null
)
RETURNS varchar(10)
AS
BEGIN
	DECLARE @results VARCHAR(10)

	SELECT TOP 1 @results =	ev.itemId

							FROM tbl_MatchData match

								LEFT JOIN tbl_MatchData_Player player
									ON player.matchId = match.matchId

								LEFT JOIN tbl_MatchData_Team team
									ON team.matchId = match.matchId
									AND team.teamId = player.teamId

								LEFT JOIN tbl_MatchData_Event ev
									ON ev.matchId = match.matchId
									AND ev.playerId = player.playerId
									AND eventType = 'ITEM_PURCHASED'

								LEFT JOIN tbl_Static_Items it
									ON it.itemId = ev.itemId

							WHERE championId = @championId
								AND winner = 1
								AND it.itemId IN (3001, 3003, 3004, 3022, 3023, 3025, 3026, 3027, 3031, 
												  3035, 3040, 3041, 3042, 3043, 3046, 3048, 3050, 3056, 
												  3060, 3065, 3068, 3069, 3071, 3072, 3075, 3078, 3083, 
												  3085, 3087, 3089, 3091, 3092, 3100, 3102, 3105, 3110, 
												  3116, 3124, 3135, 3139, 3141, 3142, 3143, 3146, 3150, 
												  3151, 3152, 3153, 3156, 3157, 3165, 3172, 3174, 3190, 
												  3285, 3290, 3401, 3430, 3431, 3434, 3460, 3504, 3508, 
												  3512, 3652, 3744, 3745, 3800, 3829, 3840, 3841, 3844, 
												  3911, 3924)

							GROUP BY ev.itemId
							ORDER BY count(distinct player.playerId) desc		

	RETURN @results

END
