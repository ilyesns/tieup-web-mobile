import { Offer } from "../../models/offer";
import Service from "../../models/service";
import { DynamicObject } from "../../models/utilities/util";
import OfferService from "../../services/offer_service";
import ServiceService from "../../services/service_service";

export default class ServicesControllers {
  static async getAllServices(): Promise<Service[] | DynamicObject[] | null> {
    const services = await ServiceService.getAllServices();
    const servicesWithApi = await Promise.all(
      services!.map(async (s) => await Service.ServiceToApi(s))
    );

    return servicesWithApi;
  }
  static async getAllSubServicesBy(
    serviceId: string
  ): Promise<Service[] | DynamicObject[] | null> {
    const services = await ServiceService.getAllServices(serviceId);
    console.log(services);
    if (services) {
      return await Promise.all(
        services!.map(async (s) => await Service.ServiceToApi(s))
      );
    }

    return null;
  }
}
