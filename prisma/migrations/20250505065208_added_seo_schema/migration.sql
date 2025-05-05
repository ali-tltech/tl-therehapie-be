BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[seo] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [seo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [pageTitle] VARCHAR(100) NOT NULL,
    [title] VARCHAR(60) NOT NULL,
    [description] VARCHAR(160) NOT NULL,
    [keywords] VARCHAR(200),
    [ogTitle] VARCHAR(95),
    [ogDescription] VARCHAR(200),
    [ogImage] TEXT,
    [ogType] VARCHAR(50),
    [twitterCard] VARCHAR(20),
    [twitterTitle] VARCHAR(70),
    [twitterDescription] VARCHAR(200),
    [twitterImage] TEXT,
    CONSTRAINT [seo_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [seo_pageTitle_key] UNIQUE NONCLUSTERED ([pageTitle])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [seo_pageTitle_idx] ON [dbo].[seo]([pageTitle]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
