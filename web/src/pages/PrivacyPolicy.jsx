import React from "react";
import { Link } from "react-router-dom";

export const PrivacyPolicy = () => {
  return (
    <div>
      <div
        className={
          " bg-white  w-full text-black z-10 ease-in-out duration-500 border-b"
        }
      >
        <div
          className={`  flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 $ z-50`}
        >
          <div className="flex-grow flex items-center">
            <h1 className=" text-3xl font-bold text-primary mr-6">
              <Link to={`/`}>TIE-UP.</Link>{" "}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
          <p className="mb-4">Last updated: March 19, 2024</p>
          <p className="mb-8">
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You. We use Your Personal data to provide and improve the
            Service. By using the Service, You agree to the collection and use
            of information in accordance with this Privacy Policy.
          </p>

          <h2 className="text-xl font-bold mb-4">
            Interpretation and Definitions
          </h2>
          <h3 className="font-bold mb-2">Interpretation</h3>
          <p className="mb-4">
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </p>

          <h3 className="font-bold mb-2">Definitions</h3>
          <p className="mb-4">For the purposes of this Privacy Policy:</p>
          <ul className="list-disc pl-8 mb-8">
            <li>
              <strong>Account</strong> means a unique account created for You to
              access our Service or parts of our Service.
            </li>
            <li>
              <strong>Affiliate</strong> means an entity that controls, is
              controlled by or is under common control with a party, where
              "control" means ownership of 50% or more of the shares, equity
              interest or other securities entitled to vote for election of
              directors or other managing authority.
            </li>
            <li>
              <strong>Application</strong> refers to Tie-Up, the software
              program provided by the Company.
            </li>
            {/* Add more list items here */}
          </ul>

          {/* Add more sections following the same pattern */}

          <h2 className="text-xl font-bold mb-4">
            Collecting and Using Your Personal Data
          </h2>
          <h3 className="font-bold mb-2">Types of Data Collected</h3>
          <p className="mb-4">Personal Data</p>
          {/* Add more content */}

          {/* Continue adding sections as needed */}

          <h2 className="text-xl font-bold mb-4">
            Disclosure of Your Personal Data
          </h2>
          <h3 className="font-bold mb-2">Business Transactions</h3>
          <p className="mb-4">
            If the Company is involved in a merger, acquisition or asset sale,
            Your Personal Data may be transferred. We will provide notice before
            Your Personal Data is transferred and becomes subject to a different
            Privacy Policy.
          </p>
          {/* Add more content */}

          <h3 className="font-bold mb-2">Law enforcement</h3>
          <p className="mb-4">
            Under certain circumstances, the Company may be required to disclose
            Your Personal Data if required to do so by law or in response to
            valid requests by public authorities (e.g. a court or a government
            agency).
          </p>
          {/* Add more content */}

          <h3 className="font-bold mb-2">Other legal requirements</h3>
          <p className="mb-4">
            The Company may disclose Your Personal Data in the good faith belief
            that such action is necessary to:
          </p>
          {/* Add more content */}

          {/* Continue adding more sections */}

          <h2 className="text-xl font-bold mb-4">
            Security of Your Personal Data
          </h2>
          <p className="mb-4">
            The security of Your Personal Data is important to Us, but remember
            that no method of transmission over the Internet, or method of
            electronic storage is 100% secure.
          </p>
          {/* Add more content */}

          <h2 className="text-xl font-bold mb-4">Children's Privacy</h2>
          <p className="mb-4">
            Our Service does not address anyone under the age of 13. We do not
            knowingly collect personally identifiable information from anyone
            under the age of 13.
          </p>
          {/* Add more content */}

          {/* Add more sections */}

          <h2 className="text-xl font-bold mb-4">
            Changes to this Privacy Policy
          </h2>
          <p className="mb-4">
            We may update Our Privacy Policy from time to time. We will notify
            You of any changes by posting the new Privacy Policy on this page.
          </p>
          {/* Add more content */}

          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, You can contact
            us:
          </p>
          <p>
            By visiting this page on our website:{" "}
            <Link className="text-blue-500">www.tieup.net/contact</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
