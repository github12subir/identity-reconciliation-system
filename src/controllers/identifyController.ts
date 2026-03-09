import { Request, Response } from "express";
import { processIdentity } from "../services/identifyService";

export const identifyContact = async (req: Request, res: Response) => {

 const { email, phoneNumber } = req.body;

 const result = await processIdentity(email, phoneNumber);

 res.status(200).json(result);

};