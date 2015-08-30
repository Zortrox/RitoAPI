CREATE TABLE [dbo].[tbl_MatchData_Player](
	[playerId] [int] IDENTITY(1,1) NOT NULL,
	[matchId] [bigint] NOT NULL,
	[participantId] [int] NULL,
	[championId] [int] NULL,
	[spell1Id] [int] NULL,
	[spell2Id] [int] NULL,
	[teamId] [int] NULL,
 CONSTRAINT [PK_tbl_MatchData_Player] PRIMARY KEY CLUSTERED 
(
	[playerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[tbl_MatchData_Player]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Player_tbl_MatchData] FOREIGN KEY([matchId])
REFERENCES [dbo].[tbl_MatchData] ([matchId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[tbl_MatchData_Player] CHECK CONSTRAINT [FK_tbl_MatchData_Player_tbl_MatchData]
GO

ALTER TABLE [dbo].[tbl_MatchData_Player]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Player_tbl_MatchData_Team] FOREIGN KEY([teamId])
REFERENCES [dbo].[tbl_MatchData_Team] ([teamId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Player] CHECK CONSTRAINT [FK_tbl_MatchData_Player_tbl_MatchData_Team]
GO

ALTER TABLE [dbo].[tbl_MatchData_Player]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Player_tbl_Static_Champions] FOREIGN KEY([championId])
REFERENCES [dbo].[tbl_Static_Champions] ([championId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Player] CHECK CONSTRAINT [FK_tbl_MatchData_Player_tbl_Static_Champions]
GO

ALTER TABLE [dbo].[tbl_MatchData_Player]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Player_tbl_Static_SummonerSpells] FOREIGN KEY([spell1Id])
REFERENCES [dbo].[tbl_Static_SummonerSpells] ([summonerSpellId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Player] CHECK CONSTRAINT [FK_tbl_MatchData_Player_tbl_Static_SummonerSpells]
GO

ALTER TABLE [dbo].[tbl_MatchData_Player]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Player_tbl_Static_SummonerSpells2] FOREIGN KEY([spell2Id])
REFERENCES [dbo].[tbl_Static_SummonerSpells] ([summonerSpellId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Player] CHECK CONSTRAINT [FK_tbl_MatchData_Player_tbl_Static_SummonerSpells2]
GO


