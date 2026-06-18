/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - Added the required column `nameEN` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameTH` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "name",
ADD COLUMN     "nameEN" TEXT NOT NULL,
ADD COLUMN     "nameTH" TEXT NOT NULL,
ADD COLUMN     "scrap" INTEGER NOT NULL DEFAULT 0;
