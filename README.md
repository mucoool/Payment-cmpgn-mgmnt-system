-->Introduction:

The Campaign Management System Backend is a server-side application that provides APIs for managing campaigns and payments. This documentation provides detailed instructions on how to set up and run the backend on your local machine. Additionally, it guides you on using Postman API to test the API endpoints and interact with the backend.

-->Installation and Setup:

•Clone the backend repository from the provided source.
•Open a terminal or command prompt and navigate to the backend directory.
•Run the following command to install the required dependencies:

     npm install

Note: You can do mongo connection through the default URI present in your local mongodb setup.

-->Starting the Backend Server:

•In the terminal or command prompt, run the following command to start the backend server:

    node server.js

•The server will start running on the default port 3000. If you want to change the port, modify the 'server.js' file.

-->Testing with Postman API:
• Launch Postman API and follow the steps below to test the API endpoints:
  (a) Create a Campaign:
   • Send a POST request to the following URL:
     http://localhost:3000/api/campaigns 

   • In the request body, provide the campaign data as JSON. For example:
      
{
  "identifier": "summer-promo-2023",
  "title": "Summer Promotion",
  "description": "Get 30% off on selected products!",
  "startDate": "2023-06-17",
  "endDate": "2023-06-28",
  "eligibilityCriteria": {
    "minimumPaymentAmount": 100,
    "paymentMethods": ["credit card", "debit card"],
    "customerSegments": ["new customers", "loyal customers"]
  },
  "incentives": "Discount, Cashback, Loyalty Points"
}

    
  (b) Get a Campaign through id:
   • Send a GET request to the following URL:
     http://localhost:3000/api/campaigns/:id

  (c) Make a Payment:
   • Send a POST request to the following URL:
     http://localhost:3000/api/campaigns/:id/payments

   • In the request body, provide the payment data as JSON. For example:
      {
       "amount": 100
      }
   (d) Participate in the campaign   
    • Send a POST request to the following URL:
      http://localhost:3000/api/campaigns/:id/participate
    Note: The customer will get participated automatically in the campaign if he/she makes a valid payment.  
   (e) Getting Analytics of campaign
    • Send a GET request to the following URL:
       http://localhost:3000/api/campaigns/:id/analytics
   (f) Record an Interaction:
    • Send a POST request to the following URL:
       http://localhost:3000/api/interactions
    • In the request body, provide the interaction data as JSON. For example:
       {
         "campaignId": "your-campaign-id",
         "userId": "your-user-id",
         "duration": 120
      }
    • Replace 'your-campaign-id' and 'your-user-id' with the actual campaign and user IDs. 
 NOTE: Replace ':id' with the actual campaign ID wherever required.

-->Conclusion:
This documentation provided detailed instructions on setting up the Campaign Management System Backend on your local machine. It also guided you on using Postman API to test the API endpoints and interact with the backend. We can add, explore and customize other API endpoints according to our requirements.


      




