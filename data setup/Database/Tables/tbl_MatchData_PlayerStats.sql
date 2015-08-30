CREATE TABLE [dbo].[tbl_MatchData_PlayerStats](
	[playerStatsId] [int] IDENTITY(1,1) NOT NULL,
	[playerId] [int] NOT NULL,
	[assists] [bigint] NULL,
	[champLevel] [bigint] NULL,
	[deaths] [bigint] NULL,
	[doubleKills] [bigint] NULL,
	[firstBloodAssist] [bit] NULL,
	[firstBloodKill] [bit] NULL,
	[firstInhibitorAssist] [bit] NULL,
	[firstInhibitorKill] [bit] NULL,
	[firstTowerAssist] [bit] NULL,
	[firstTowerKill] [bit] NULL,
	[goldEarned] [bigint] NULL,
	[goldSpent] [bigint] NULL,
	[inhibitorKils] [bigint] NULL,
	[item0] [bigint] NULL,
	[item1] [bigint] NULL,
	[item2] [bigint] NULL,
	[item3] [bigint] NULL,
	[item4] [bigint] NULL,
	[item5] [bigint] NULL,
	[item6] [bigint] NULL,
	[killingSprees] [bigint] NULL,
	[kills] [bigint] NULL,
	[largestCriticalStrike] [bigint] NULL,
	[largestKillingSpree] [bigint] NULL,
	[largestMultikill] [bigint] NULL,
	[magicDamageDealt] [bigint] NULL,
	[magicDamageDealtToChampions] [bigint] NULL,
	[magicDamageTaken] [bigint] NULL,
	[minionsKilled] [bigint] NULL,
	[neutralMinionsKilled] [bigint] NULL,
	[neutralMinionsKilledEnemyJungle] [bigint] NULL,
	[neutralMinionsKilledTeamJungle] [bigint] NULL,
	[pentaKills] [bigint] NULL,
	[physicalDamageDealt] [bigint] NULL,
	[physicalDamageDealtToChampions] [bigint] NULL,
	[physicalDamageTaken] [bigint] NULL,
	[quadraKills] [bigint] NULL,
	[sightWardsBoughtInGame] [bigint] NULL,
	[totalDamageDealt] [bigint] NULL,
	[totalDamageDealtToChampions] [bigint] NULL,
	[totalDamageTaken] [bigint] NULL,
	[totalHeal] [bigint] NULL,
	[totalTimeCrowdControlDealt] [bigint] NULL,
	[totalUnitsHealed] [bigint] NULL,
	[towerKills] [bigint] NULL,
	[tripleKills] [bigint] NULL,
	[trueDamageDealt] [bigint] NULL,
	[trueDamageDealtToChampions] [bigint] NULL,
	[trueDamageTaken] [bigint] NULL,
	[unrealKills] [bigint] NULL,
	[visionWardsBoughtInGame] [bigint] NULL,
	[wardsKilled] [bigint] NULL,
	[wardsPlaced] [bigint] NULL,
	[winner] [bit] NULL,
 CONSTRAINT [PK_tbl_MatchData_PlayerStats] PRIMARY KEY CLUSTERED 
(
	[playerStatsId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_MatchData_Player] FOREIGN KEY([playerId])
REFERENCES [dbo].[tbl_MatchData_Player] ([playerId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats] CHECK CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_MatchData_Player]
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items] FOREIGN KEY([item0])
REFERENCES [dbo].[tbl_Static_Items] ([itemId])
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats] CHECK CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items]
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items1] FOREIGN KEY([item1])
REFERENCES [dbo].[tbl_Static_Items] ([itemId])
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats] CHECK CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items1]
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items2] FOREIGN KEY([item2])
REFERENCES [dbo].[tbl_Static_Items] ([itemId])
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats] CHECK CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items2]
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items3] FOREIGN KEY([item3])
REFERENCES [dbo].[tbl_Static_Items] ([itemId])
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats] CHECK CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items3]
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items4] FOREIGN KEY([item4])
REFERENCES [dbo].[tbl_Static_Items] ([itemId])
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats] CHECK CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items4]
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items5] FOREIGN KEY([item5])
REFERENCES [dbo].[tbl_Static_Items] ([itemId])
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats] CHECK CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items5]
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items6] FOREIGN KEY([item6])
REFERENCES [dbo].[tbl_Static_Items] ([itemId])
GO

ALTER TABLE [dbo].[tbl_MatchData_PlayerStats] CHECK CONSTRAINT [FK_tbl_MatchData_PlayerStats_tbl_Static_Items6]
GO


