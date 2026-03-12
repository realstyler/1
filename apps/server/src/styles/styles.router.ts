import { Router, type Router as ExpressRouter } from "express";
import { stylesController } from "./styles.controller.js";

const stylesRouter: ExpressRouter = Router();

stylesRouter.get("/styles", stylesController.getStyles.bind(stylesController));
stylesRouter.post("/styles/refresh", stylesController.refreshStyles.bind(stylesController));

export default stylesRouter;