CREATE TABLE [dbo].[tbl_MatchData](
	[matchId] [bigint] NOT NULL,
	[matchCreation] [bigint] NOT NULL,
	[matchDuration] [bigint] NOT NULL,
	[region] [varchar](20) NULL,
 CONSTRAINT [PK_tbl_MatchData_1] PRIMARY KEY CLUSTERED 
(
	[matchId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

