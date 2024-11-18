-- AlterTable
ALTER TABLE "FriendRequest" ADD COLUMN     "userIds" INTEGER[];

-- CreateTable
CREATE TABLE "_AllFriendRequest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AllFriendRequest_AB_unique" ON "_AllFriendRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_AllFriendRequest_B_index" ON "_AllFriendRequest"("B");

-- AddForeignKey
ALTER TABLE "_AllFriendRequest" ADD CONSTRAINT "_AllFriendRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "FriendRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllFriendRequest" ADD CONSTRAINT "_AllFriendRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
