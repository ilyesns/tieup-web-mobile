import { TypeUser ,Role } from '../src/utilities/enums';
import  admin  from '../src/config/firebase.config'; // Make sure you have initialized Firebase correctly in another file
import Education from '../src/models/education';
import Client from '../src/models/client';
import ClientService from '../src/services/client_service';
import FreelancerService from '../src/services/freelancer_service';
import PortfolioService from '../src/services/portfolio_service';

const db = admin.firestore();

// A mock Firestore class for testing purposes

// Test function to verify Client class methods
 async function testClientMethods() {

    const docRef = db.collection('users').doc('TI7fwnt4EYdbfoKnHG9WBcGpPXY2');

    const docSnapshot = await docRef.get();


  const client = ClientService.fromSnapshot(docSnapshot);


  // Set the database instance in your Client class to use the mock
    return client;
  // Test the save method

}

export default async function testFreelancerMethods() {

    

    const  freelancerId = await db.collection('users').doc('DozggkzFjMLw3PFosF0F');
    const freelancerGetting = await freelancerId.get();

    const freelancer = FreelancerService.fromSnapshot(freelancerGetting);

    const portfolio =  await PortfolioService.createPortfolio( freelancer.documentId ,[]);
  console.log(portfolio)
  // Set the database instance in your Client class to use the mock
    return freelancer;
  // Test the save method

}



// Call the test function

