// Get the current date in YYYY-MM-DD format
import "firebase/storage";
import { storage } from "./config/firebase_config";
import { ref, getDownloadURL } from "firebase/storage";

const BASE_URL = "https://tieup-6eea9.ew.r.appspot.com/api/"; //https://tieup.yagri.app/api/ https://tieup-6eea9.ew.r.appspot.com/api/
const maxDate = new Date().toISOString().split("T")[0];

function extractRootServices(data) {
  const rootServices = data.filter((service) => service.isRoot);
  const result = rootServices.map((root) => {
    const subservices = data.filter(
      (service) =>
        service.parentServiceId === root.documentRef && !service.isRoot
    );
    return {
      name: root.name,
      description: root.description,
      topic: root.topic,
      image: root.image,
      documentRef: root.documentRef,
      subServices: subservices.map((sub) => ({
        name: sub.name,
        description: sub.description,
        topic: sub.topic,
        image: sub.image,
        documentRef: sub.documentRef,
      })),
    };
  });
  return result;
}
function extractSubService(data, subserviceId) {
  let rootService;

  // Find the root service containing the subservice
  data.some((service) => {
    if (
      service.subServices &&
      service.subServices.some((sub) => sub.documentRef === subserviceId)
    ) {
      rootService = service;
      return true;
    }
    return false;
  });

  if (!rootService) {
    // Return null if subserviceId not found
    return null;
  }

  // Find the subservice within the root service
  const subservice = rootService.subServices.find(
    (sub) => sub.documentRef === subserviceId
  );

  return {
    rootService: {
      name: rootService.name,
      description: rootService.description,
      topic: rootService.topic,
      image: rootService.image,
      documentRef: rootService.documentRef,
    },
    subservice: {
      name: subservice.name,
      description: subservice.description,
      topic: subservice.topic,
      image: subservice.image,
      documentRef: subservice.documentRef,
    },
  };
}

function extractSubServices(data) {
  const services = data.filter((service) => service.isRoot === false);

  if (!services) {
    // Return empty array if serviceId not found
    return [];
  }

  const subs = services.map((sub) => ({
    name: sub.name,
    description: sub.description,
    topic: sub.topic,
    image: sub.image,
    documentRef: sub.documentRef,
  }));
  return services;
}

function extractSubServicesByServiceId(data, serviceId) {
  const service = data.find((service) => service.documentRef === serviceId);

  if (!service) {
    // Return empty array if serviceId not found
    return [];
  }

  const subServices = data.filter(
    (subService) =>
      subService.parentServiceId === service.documentRef && !subService.isRoot
  );
  const subs = subServices.map((sub) => ({
    name: sub.name,
    description: sub.description,
    topic: sub.topic,
    image: sub.image,
    documentRef: sub.documentRef,
  }));
  subs.rootName = service.name;
  return subs;
}
function storeObjectInLocalStorage(objectKey, objectValue) {
  // Check if local storage is supported by the browser
  if (typeof Storage !== "undefined") {
    // Convert the object to a JSON string before storing
    const jsonValue = JSON.stringify(objectValue);
    // Store the JSON string in local storage with the provided key
    localStorage.setItem(objectKey, jsonValue);
    console.log(`Object with key ${objectKey} stored in local storage.`);
  } else {
    console.error("Local storage is not supported by this browser.");
  }
}
function splitFullName(fullName) {
  // Split the full name into an array of words
  var nameArray = fullName.trim().split(/\s+/);

  // Extract the first name (first element in the array)
  var firstName = nameArray[0];

  // Extract the last name (join the remaining elements with spaces)
  var lastName = nameArray.slice(1).join(" ");

  // Return an object containing the first name and last name
  return {
    firstName: firstName,
    lastName: lastName,
  };
}

const downloadFile = async (fileUrl, fileName) => {
  try {
    const storageRef = ref(storage, fileUrl);
    const url = await getDownloadURL(storageRef);

    const response = await fetch(url);
    const blob = await response.blob();

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName || "file"; // Setting the default file name if fileName is not provided
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

const LANGUAGES = [
  "Arabic",
  "French",
  "English",
  "Spanish",
  "Mandarin Chinese",
  "Hindi",
  "Bengali",
  "Portuguese",
  "Russian",
  "Japanese",
  "German",
  "Korean",
  "Italian",
  "Turkish",
  "Vietnamese",
  "Urdu",
  "Polish",
  "Ukrainian",
  "Malay",
  "Thai",
  "Dutch",
  "Filipino (Tagalog)",
  "Romanian",
  "Greek",
  "Czech",
  "Swedish",
  "Hungarian",
  "Danish",
  "Finnish",
];
const YEARS = [
  1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997,
  1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
  2024, 2025, 2026,
];

function getCurrentMonthName() {
  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get current date
  const currentDate = new Date();

  // Get month number (0-indexed)
  const monthNumber = currentDate.getMonth();

  // Get month name from array
  const monthName = monthNames[monthNumber];

  return monthName;
}
function convertTimestampToComponents(timestamp) {
  // Convert timestamp to milliseconds
  const milliseconds = timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6;

  // Create a new Date object
  const date = new Date(milliseconds);

  // Get date components
  const hour = date.getHours();
  const minute = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-indexed, so add 1
  const year = date.getFullYear();

  // Return an object with the date components
  return {
    hour,
    minute,
    day,
    month,
    year,
  };
}

const DELIVERY_DAYS = [
  "1 day delivery",
  "2 days delivery",
  "3 days delivery",
  "4 days delivery",
  "5 days delivery",
  "6 days delivery",
  "7 days delivery",
  "10 days delivery",
  "14 days delivery",
  "20 days delivery",
  "24 days delivery",
  "30 days delivery",
  "35 days delivery",
  "40 days delivery",
  "45 days delivery",
  "46 days delivery",
  "47 days delivery",
  "48 days delivery",
  "49 days delivery",
  "50 days delivery",
  "51 days delivery",
  "52 days delivery",
  "53 days delivery",
  "54 days delivery",
  "55 days delivery",
  "56 days delivery",
  "57 days delivery",
  "58 days delivery",
  "59 days delivery",
  "60 days delivery",
  "70 days delivery",
];

const planType = ["basicPlan", "premiumPlan"];

function categorizeOffers(offers) {
  const categorizedOffers = {
    active: [],
    inactive: [],
    pendingApproval: [],
    denied: [],
    draft: [],
  };

  offers.forEach((offer) => {
    switch (offer.offer.status) {
      case "active":
        categorizedOffers.active.push(offer);
        break;
      case "inactive":
        categorizedOffers.inactive.push(offer);
        break;
      case "pendingApproval":
        categorizedOffers.pendingApproval.push(offer);
        break;
      case "denied":
        categorizedOffers.denied.push(offer);
        break;
      case "draft":
        categorizedOffers.draft.push(offer);
        break;
      default:
        break;
    }
  });

  return categorizedOffers;
}

function categorizeOrders(orders) {
  const categorizedOrders = {
    pending: [],
    inProgress: [],
    delivered: [],
    completed: [],
    cancelled: [],
    late: [],
  };

  orders.forEach((order) => {
    switch (order.status) {
      case "pending":
        categorizedOrders.pending.push(order);
        break;
      case "inProgress":
        categorizedOrders.inProgress.push(order);
        break;
      case "delivered":
        categorizedOrders.delivered.push(order);
        break;
      case "completed":
        categorizedOrders.completed.push(order);
        break;
      case "cancelled":
        categorizedOrders.cancelled.push(order);
        break;
      case "late":
        categorizedOrders.late.push(order);
        break;
      default:
        break;
    }
  });

  return categorizedOrders;
}

const getOffer = (data, offerRef) => {
  // Search for the offer with the provided offer reference
  if (data) {
    const foundOffer = data.find(
      (offer) => offer.offer.documentRef === offerRef
    );
    return foundOffer || null;
  }
  // Return the found offer or null if not found
};

const RevisionsTimes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function getDocumentIds(documentRefs) {
  const ids = [];
  // Iterate over each document reference
  for (const docRef of documentRefs) {
    ids.push(docRef.id);
  }
  return ids;
}
function filterChatsByLastMessageSeen(chats, currentUserID) {
  return chats.filter((chat) => {
    // Check if the chat has any messages
    let lastMessageUserID = getDocumentIds(chat.lastMessageSeenBy) || [];
    let users = getDocumentIds(chat.users) || [];
    if (
      users.includes(currentUserID) &&
      !lastMessageUserID.includes(currentUserID)
    ) {
      // Check if the last message was seen by the current user
      return true;
    }
    return false; // Exclude chat if conditions are not met
  });
}
export {
  BASE_URL,
  maxDate,
  getDocumentIds,
  filterChatsByLastMessageSeen,
  extractRootServices,
  extractSubServicesByServiceId,
  storeObjectInLocalStorage,
  extractSubService,
  splitFullName,
  LANGUAGES,
  YEARS,
  getOffer,
  DELIVERY_DAYS,
  categorizeOrders,
  RevisionsTimes,
  convertTimestampToComponents,
  getCurrentMonthName,
  categorizeOffers,
  extractSubServices,
  downloadFile,
};
