CREATE TABLE [dbo].[tbl_MatchData_Team](
	[teamId] [int] IDENTITY(1,1) NOT NULL,
	[matchId] [bigint] NOT NULL,
	[color] [varchar](10) NULL,
	[winner] [bit] NULL,
	[baronKills] [int] NULL,
	[dragonKills] [int] NULL,
	[firstBaron] [bit] NULL,
	[firstBlood] [bit] NULL,
	[firstDragon] [bit] NULL,
	[firstInhibitor] [bit] NULL,
	[firstTower] [bit] NULL,
	[inhibitorKills] [int] NULL,
	[towerKills] [int] NULL,
 CONSTRAINT [PK_tbl_MatchData_Team] PRIMARY KEY CLUSTERED 
(
	[teamId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[tbl_MatchData_Team]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Team_tbl_MatchData] FOREIGN KEY([matchId])
REFERENCES [dbo].[tbl_MatchData] ([matchId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[tbl_MatchData_Team] CHECK CONSTRAINT [FK_tbl_MatchData_Team_tbl_MatchData]
GO


