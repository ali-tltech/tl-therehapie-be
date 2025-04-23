BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[CompanySettings] (
    [id] NVARCHAR(1000) NOT NULL,
    [logo] NVARCHAR(1000),
    [location] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [mapUrl] NVARCHAR(1000),
    [favicon] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CompanySettings_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [CompanySettings_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [CompanySettings_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [CompanySettings_phone_key] UNIQUE NONCLUSTERED ([phone])
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
