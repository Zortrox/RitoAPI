CREATE TABLE [dbo].[tbl_MatchData_Bans](
	[banId] [int] IDENTITY(1,1) NOT NULL,
	[matchId] [bigint] NOT NULL,
	[ban1] [int] NULL,
	[ban2] [int] NULL,
	[ban3] [int] NULL,
	[ban4] [int] NULL,
	[ban5] [int] NULL,
	[ban6] [int] NULL,
 CONSTRAINT [PK_tbl_MatchData_Bans] PRIMARY KEY CLUSTERED 
(
	[banId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[tbl_MatchData_Bans]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Bans_tbl_MatchData] FOREIGN KEY([matchId])
REFERENCES [dbo].[tbl_MatchData] ([matchId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans] CHECK CONSTRAINT [FK_tbl_MatchData_Bans_tbl_MatchData]
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions] FOREIGN KEY([ban1])
REFERENCES [dbo].[tbl_Static_Champions] ([championId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans] CHECK CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions]
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions2] FOREIGN KEY([ban2])
REFERENCES [dbo].[tbl_Static_Champions] ([championId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans] CHECK CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions2]
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions3] FOREIGN KEY([ban3])
REFERENCES [dbo].[tbl_Static_Champions] ([championId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans] CHECK CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions3]
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions4] FOREIGN KEY([ban4])
REFERENCES [dbo].[tbl_Static_Champions] ([championId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans] CHECK CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions4]
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions5] FOREIGN KEY([ban5])
REFERENCES [dbo].[tbl_Static_Champions] ([championId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans] CHECK CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions5]
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions6] FOREIGN KEY([ban6])
REFERENCES [dbo].[tbl_Static_Champions] ([championId])
GO

ALTER TABLE [dbo].[tbl_MatchData_Bans] CHECK CONSTRAINT [FK_tbl_MatchData_Bans_tbl_Static_Champions6]
GO


