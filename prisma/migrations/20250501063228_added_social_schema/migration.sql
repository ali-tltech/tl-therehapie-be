BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Blog] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [author] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [excerpt] TEXT NOT NULL,
    [content] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Blog_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Blog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Otp] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [otp] NVARCHAR(1000) NOT NULL,
    [isVerified] BIT NOT NULL CONSTRAINT [Otp_isVerified_df] DEFAULT 0,
    [expiresAt] DATETIME2 NOT NULL,
    CONSTRAINT [Otp_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Otp_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Social] (
    [id] NVARCHAR(1000) NOT NULL,
    [platform] NVARCHAR(1000),
    [url] NVARCHAR(1000) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Social_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Social_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Social_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Blog_date_idx] ON [dbo].[Blog]([date]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Blog_author_idx] ON [dbo].[Blog]([author]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Blog_createdAt_idx] ON [dbo].[Blog]([createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Otp_email_idx] ON [dbo].[Otp]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Social_platform_idx] ON [dbo].[Social]([platform]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Social_isActive_idx] ON [dbo].[Social]([isActive]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
