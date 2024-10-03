import { Request, Response } from "express";
import Service from "../../models/service";
import { DynamicObject, withoutNulls } from "../../models/utilities/util";
import ServiceService from "../../services/service_service";
import { deleteFileFromFirebaseStorage } from "../../utilities/firestorage_methods";
import { uploadImages } from "../../utilities/functions";
import { areSameDocument } from "../../utilities/util";

export default class AdminServiceController {
  static async createService(req: Request, res: Response): Promise<void> {
    const file = req.file;
    const { name, createdBy, description, topic, isRoot, parentServiceId } =
      req.body;

    const image = (await uploadImages([file!], createdBy, "services"))[0].url;
    let serviceRef;
    try {
      if (isRoot == true || isRoot == "true") {
        await ServiceService.createService({
          topic: topic,
          name: name,
          description: description,
          image: image,
          isRoot: true,
          createdBy: createdBy,
        });
      } else {
        serviceRef = await ServiceService.createService({
          topic: topic,
          name: name,
          description: description,
          image: image,
          isRoot: false,
          createdBy: createdBy,
          parentServiceId: parentServiceId,
        });
        await ServiceService.addSubService(serviceRef, parentServiceId);
      }

      res.status(200).send({ message: "Service created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to create a service",
        error: error!.toString(),
      });
    }
  }
  static async updateService(req: Request, res: Response): Promise<void> {
    const file = req.file;

    const { name, createdBy, description, topic, parentServiceId } = req.body;
    const serviceId = req.params.serviceId;
    const image = file
      ? (await uploadImages([file!], createdBy, "services"))[0].url
      : null;

    try {
      const service = await ServiceService.getService(serviceId)!;

      if (service?.isRoot == true) {
        await ServiceService.updateService(
          serviceId,
          withoutNulls({
            name: name,
            description: description,
            image: image!,
          })
        );
      } else {
        const subService = await ServiceService.getService(serviceId);

        if (subService?.parentServiceId === parentServiceId) {
          await ServiceService.updateService(
            serviceId,
            withoutNulls({
              name: name,
              description: description,
              topic: topic,
              parentServiceId: parentServiceId,
              image: image!,
            })
          );
        } else {
          await ServiceService.removeSubService(
            subService?.documentRef!,
            subService!.parentServiceId!
          );
          await ServiceService.addSubService(
            subService?.documentRef!,
            parentServiceId!
          );
          await ServiceService.updateService(
            serviceId,
            withoutNulls({
              name: name,
              description: description,
              topic: topic,
              parentServiceId: parentServiceId,
              image: image!,
            })
          );
        }
      }
      res.status(200).send({ message: "service updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to update the service",
        error: error!.toString(),
      });
    }
  }
  static async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const serviceId = req.params.serviceId;
      let message = "";

      const service = await ServiceService.getService(serviceId);
      if (service) {
        if (service?.isRoot) {
          if (service?.subServices!.length! <= 0) {
            await ServiceService.deleteService(service!);
            message = "Service deleted successfully";
          } else {
            message = "you can not delete this service ,it's root.";
          }
        } else {
          await ServiceService.removeSubService(
            service!.documentRef!,
            service!.parentServiceId!
          );
          await ServiceService.deleteService(service!);
          message = "Service deleted successfully";
        }
      } else {
        message = "No such Service found";
      }
      res.status(200).send({ message: message });
    } catch (error) {
      // Log the error and send an error response
      console.error(error);
      res.status(500).send({
        message: "Failed to delete Service",
        error: error!.toString(),
      });
    }
  }
  static async getAllServices(): Promise<Service[] | null> {
    return await ServiceService.getAllServices();
  }
  static async getAllSubServicesBy(
    data: DynamicObject
  ): Promise<Service[] | null> {
    return await ServiceService.getAllServices(data.serviceId);
  }

  static async search(req: Request, res: Response): Promise<void> {
    try {
      const term = req.query.term as string;

      let services = await ServiceService.search(term);

      res.status(200).json(services);
    } catch (error) {
      // Log the error and send an error response
      console.error(error);
      res.status(500).send({
        message: "Failed to delete Service",
        error: error!.toString(),
      });
    }
  }
}
