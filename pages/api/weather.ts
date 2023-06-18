// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RouteRequestBody } from "./interfaces";
import { filterAirports } from "./logic";
import logger from "./logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: RouteRequestBody = JSON.parse(req.body);
  logger.log({
    level: "info",
    message: `Processing request for airport: ${body.airportFilters.departureAirport}`,
  });
  const airports = await filterAirports(body.airportFilters);
  res
    .status(200)
    .json({ from: body.airportFilters.departureAirport, airports: airports });
}

export const config = {
  api: {
    responseLimit: false,
  },
};
