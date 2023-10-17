-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "color" TEXT,
    "xPos" INTEGER NOT NULL,
    "yPos" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Column" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" TEXT NOT NULL,
    "length" INTEGER,
    "default" TEXT,
    "pkey" BOOLEAN NOT NULL DEFAULT false,
    "ai" BOOLEAN NOT NULL DEFAULT false,
    "allowNull" BOOLEAN NOT NULL DEFAULT false,
    "tableId" INTEGER NOT NULL,
    "parentColumnId" INTEGER,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_parentColumnId_fkey" FOREIGN KEY ("parentColumnId") REFERENCES "Column"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
