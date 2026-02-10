-- CreateTable
CREATE TABLE "style_prompt" (
    "preset" "StylePreset" NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "color_palette" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "style_prompt_pkey" PRIMARY KEY ("preset")
);
