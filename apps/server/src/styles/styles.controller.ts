import type { Request, Response } from "express";
import { stylesService } from "./styles.service.js";

export class StylesController {
  public getStyles(req: Request, res: Response): void {
    try {
      const styles = stylesService.getPublicStyles();
      res.json(styles);
    } catch (error) {
      console.error("[StylesController] Error fetching styles:", error);
      res.status(500).json({ error: "Failed to retrieve styles" });
    }
  }

  public async refreshStyles(req: Request, res: Response): Promise<void> {
    try {
      await stylesService.reload();
      res.status(204).end();
    } catch (error) {
      console.error("[StylesController] Error refreshing styles:", error);
      res.status(500).json({ error: "Failed to refresh styles" });
    }
  }
}

export const stylesController = new StylesController();