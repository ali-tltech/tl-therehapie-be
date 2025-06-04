/*
  Warnings:

  - You are about to alter the column `question` on the `FAQ` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[FAQ] ALTER COLUMN [question] VARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[FAQ] ALTER COLUMN [order] INT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
