import type { Context } from "hono";
import client from "../../../utils/request";
import { constructHeaders } from "../utils";
import { companies } from "../../../config/companies";

type ParcelData = {
  name: string;
  phone: string;
  address: string;
  // Add other EcoTrack fields as needed
};

export const createParcel = async (data: ParcelData, c: Context) => {
  const token = process.env.ECOTRACK_TOKEN;
  const { company } = c.req.param();
  const companyConfig = companies[company];
  if (!token) throw new Error("Missing ECOTRACK_TOKEN");

  const headersConfig = constructHeaders(c);

  const response = await client.post(
    `${companyConfig.endpoint}/shipments`,
    data,
    headersConfig
  );

  return {
    status: response.status,
    data: response.data,
  };
};
