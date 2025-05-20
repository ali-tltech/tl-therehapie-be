BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Newsletter] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Newsletter_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [unSubscribeToken] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Newsletter_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Newsletter_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Newsletter_unSubscribeToken_key] UNIQUE NONCLUSTERED ([unSubscribeToken])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
