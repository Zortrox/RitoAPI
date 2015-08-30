CREATE TABLE [dbo].[tbl_MatchData_Event](
	[eventId] [int] IDENTITY(1,1) NOT NULL,
	[matchId] [bigint] NOT NULL,
	[playerId] [int] NULL,
	[player2Id] [int] NULL,
	[eventType] [varchar](50) NULL,
	[itemId] [bigint] NULL,
	[buildingType] [varchar](50) NULL,
	[laneType] [varchar](50) NULL,
	[levelUpType] [varchar](50) NULL,
	[monsterType] [varchar](50) NULL,
	[skillSlot] [int] NULL,
	[buildingColor] [varchar](10) NULL,
	[timestamp] [bigint] NULL,
	[towerType] [varchar](50) NULL,
	[posx] [int] NULL,
	[posy] [int] NULL,
 CONSTRAINT [PK_tbl_MatchData_Event] PRIMARY KEY CLUSTERED 
(
	[eventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[tbl_MatchData_Event]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Event_tbl_MatchData] FOREIGN KEY([matchId])
REFERENCES [dbo].[tbl_MatchData] ([matchId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[tbl_MatchData_Event] CHECK CONSTRAINT [FK_tbl_MatchData_Event_tbl_MatchData]
GO

ALTER TABLE [dbo].[tbl_MatchData_Event]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Event_tbl_MatchData_Player] FOREIGN KEY([playerId])
REFERENCES [dbo].[tbl_MatchData_Player] ([playerId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Event] CHECK CONSTRAINT [FK_tbl_MatchData_Event_tbl_MatchData_Player]
GO

ALTER TABLE [dbo].[tbl_MatchData_Event]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Event_tbl_MatchData_Player2] FOREIGN KEY([player2Id])
REFERENCES [dbo].[tbl_MatchData_Player] ([playerId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Event] CHECK CONSTRAINT [FK_tbl_MatchData_Event_tbl_MatchData_Player2]
GO

ALTER TABLE [dbo].[tbl_MatchData_Event]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Event_tbl_Static_Items] FOREIGN KEY([itemId])
REFERENCES [dbo].[tbl_Static_Items] ([itemId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Event] CHECK CONSTRAINT [FK_tbl_MatchData_Event_tbl_Static_Items]
GO


