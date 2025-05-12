BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Enquiries] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [subject] NVARCHAR(1000) NOT NULL,
    [message] TEXT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Enquiries_status_df] DEFAULT 'unread',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Enquiries_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Enquiries_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Enquiries_email_idx] ON [dbo].[Enquiries]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Enquiries_status_idx] ON [dbo].[Enquiries]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Enquiries_createdAt_idx] ON [dbo].[Enquiries]([createdAt]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
