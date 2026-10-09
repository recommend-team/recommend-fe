import type { LegalDoc } from "./types";

/**
 * Recommend Privacy Policy — effective 8 October 2026. Wording as supplied; do not paraphrase.
 *
 * One line is left out: the source's "WhatsApp: [Recommend business number]" in 11.1 is an
 * unfilled placeholder. Add it back with the real number once there is one.
 */
export const PRIVACY: LegalDoc = {
  eyebrow: "PRIVACY POLICY",
  title: "Privacy Policy",
  summary:
    "What personal information Recommend collects, why, who we share it with, how long we keep it, and the rights you have over it under Nigerian law.",
  lastUpdated: "8 October 2026",
  effective: "8 October 2026",
  sections: [
    {
      id: "introduction",
      title: "Introduction and Who We Are",
      blocks: [
        {
          p: "This Privacy Policy describes how Brand Collaborator Limited (“**Recommend**”, “**we**”, “**us**”, or “**our**”) collects, uses, stores, shares, and protects the personal information of users (“**you**” or “**your**”) who interact with our platform, including through WhatsApp, our website, and any related services (collectively, the “**Service**”).",
        },
        {
          p: "We are committed to protecting your privacy and processing your personal data responsibly, lawfully, and transparently. This Policy is issued in compliance with:",
        },
        {
          list: [
            "The **Nigeria Data Protection Regulation 2019 (NDPR)** and its Implementation Framework;",
            "The **Nigeria Data Protection Act 2023 (NDPA)**;",
            "Any other applicable data protection laws in force in Nigeria.",
          ],
        },
        {
          p: "By using Recommend — including by messaging our WhatsApp line, placing an order, registering as a vendor, or visiting our website — you acknowledge that you have read and understood this Privacy Policy. If you do not agree, you must not use the Service.",
        },
        { p: "This Policy applies to:" },
        {
          list: [
            "**Buyers** who place orders through our WhatsApp channel or website;",
            "**Vendors** (restaurants, grocery stores, pharmacies, and other merchants) registered on our platform;",
            "**Riders and logistics agents** who fulfil deliveries;",
            "**Visitors** to our website or any Recommend-operated digital channel.",
          ],
        },
        {
          title: "Governing Law",
          note: "This Policy is governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.",
        },
      ],
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      blocks: [
        { p: "We collect personal information in the following categories:" },
        { h: "2.1 Information You Provide Directly" },
        {
          list: [
            "**Identity data:** full name, phone number, email address;",
            "**Delivery data:** delivery address, landmark notes, geolocation (where provided);",
            "**Account data:** login credentials, account preferences;",
            "**Order data:** items ordered, vendor selected, special instructions;",
            "**Payment data:** transaction references, payment method type (we do not store full card numbers; payment processing is handled by licensed third-party payment processors);",
            "**Vendor onboarding data:** business name, CAC registration details, bank account details, menu information, operating hours;",
            "**Rider/logistics data:** name, phone, vehicle details, National ID or driver’s licence number, bank account details.",
          ],
        },
        { h: "2.2 Information Collected Automatically" },
        {
          list: [
            "**Chat metadata:** timestamps, message delivery status, WhatsApp phone number, chat session data generated through WhatsApp Business API;",
            "**Device and technical data:** IP address, device type, operating system, browser type, referring URL;",
            "**Usage data:** pages visited, features used, click patterns, session duration;",
            "**Location data:** approximate or precise location, where enabled by you on your device.",
          ],
        },
        { h: "2.3 Information from Third Parties" },
        {
          list: [
            "Data from payment processors confirming transaction status;",
            "Data from logistics partners (Whoosh NG and others) confirming delivery status;",
            "Data from WhatsApp / Meta Platforms Inc. relating to message delivery and business account metrics;",
            "Publicly available business information used for vendor verification.",
          ],
        },
        { h: "2.4 Special Categories of Data" },
        {
          p: "We do not intentionally collect special categories of personal data (such as health, biometric, religious, or political data). If such data is incidentally shared with us, it will be deleted as soon as it is identified, unless we are required by law to retain it.",
        },
        { h: "2.5 Sensitive Financial Data" },
        {
          note: "All payment card data is processed directly by PCI-DSS-compliant third-party payment processors. We store only payment transaction references and status confirmations — never full card numbers, CVV codes, or bank PINs.",
        },
      ],
    },
    {
      id: "how-we-use-your-information",
      title: "How We Use Your Information",
      blocks: [
        {
          p: "We process personal data only for lawful purposes and on one or more of the following legal bases under the NDPR and NDPA:",
        },
        {
          table: {
            head: ["Purpose", "Legal Basis"],
            rows: [
              ["Processing and fulfilling your orders", "Performance of a contract"],
              ["Verifying vendor and rider identity", "Legal obligation; Legitimate interest"],
              ["Processing payments", "Performance of a contract"],
              [
                "Sending transactional notifications (order confirmed, rider dispatched, delivered)",
                "Performance of a contract",
              ],
              ["Communicating service updates and changes to this Policy", "Legitimate interest"],
              ["Sending promotional messages (where opted in)", "Consent"],
              ["Fraud detection, security, and abuse prevention", "Legitimate interest; Legal obligation"],
              [
                "Complying with a court order, regulatory request, or law enforcement demand",
                "Legal obligation",
              ],
              ["Improving and developing the Service through analytics", "Legitimate interest"],
              ["Resolving disputes and enforcing our Terms of Service", "Legitimate interest; Legal obligation"],
            ],
          },
        },
        { h: "3.1 Marketing Communications" },
        {
          p: "We will only send you marketing or promotional messages via WhatsApp, email, or SMS if you have given us explicit consent or opted in. You may withdraw consent at any time by replying STOP to any WhatsApp marketing message or by contacting us at legal@getrecommend.co. Withdrawal of consent does not affect the lawfulness of processing before withdrawal.",
        },
        { h: "3.2 Automated Decision-Making" },
        {
          p: "We may use automated processes to match your order request to nearby vendors, calculate delivery fees, and detect potentially fraudulent activity. These automated processes do not produce legal or similarly significant effects on you. Where a decision may significantly affect you (for example, suspension of a vendor or rider account), a human review will be conducted upon request.",
        },
      ],
    },
    {
      id: "sharing-and-disclosure",
      title: "Sharing and Disclosure",
      blocks: [
        {
          note: "**We do not sell your personal data.** We share your personal data only in the following limited circumstances:",
        },
        { h: "4.1 Vendors" },
        {
          p: "When you place an order, we share your name, phone number, delivery address, and order details with the relevant vendor to enable fulfilment. Vendors are contractually prohibited from using your data for any purpose other than fulfilling your order.",
        },
        { h: "4.2 Logistics and Delivery Partners" },
        {
          p: "We share your name, phone number, and delivery address with our logistics partner (currently Whoosh NG and any successor or additional logistics providers) solely to enable delivery. Logistics partners are not permitted to use your data for marketing or any secondary purpose.",
        },
        { h: "4.3 Payment Processors" },
        {
          p: "Payment data is processed by third-party payment service providers licensed by the Central Bank of Nigeria (CBN). These providers process payment data under their own privacy policies and applicable PCI-DSS standards. We share only what is necessary to complete the transaction.",
        },
        { h: "4.4 Service Providers and Sub-Processors" },
        {
          p: "We may engage trusted third-party service providers (“sub-processors”) to operate parts of the Service, including cloud hosting, SMS/email delivery, analytics, and customer support tools. All sub-processors are bound by data processing agreements that prohibit them from using your data for purposes beyond the services they provide to us.",
        },
        { h: "4.5 Legal and Regulatory Disclosure" },
        {
          p: "We may disclose personal data if required to do so by law, court order, or a valid request from a government authority, law enforcement agency, or regulatory body in Nigeria. We will, where legally permitted, notify you of such a request before disclosing.",
        },
        { h: "4.6 Business Transfers" },
        {
          p: "In the event of a merger, acquisition, restructuring, or sale of all or part of our assets, your personal data may be transferred to the successor entity. We will notify you of any such transfer via WhatsApp or email and will ensure the successor entity is bound by terms at least as protective as this Policy.",
        },
        { h: "4.7 Aggregated and Anonymised Data" },
        {
          p: "We may share aggregated, de-identified, or anonymised data (which cannot reasonably be used to identify you) with partners, investors, or for public reporting. This is not subject to this Policy.",
        },
        { h: "4.8 No Cross-Border Transfers Without Safeguards" },
        {
          p: "If we ever transfer personal data outside Nigeria, we will only do so in compliance with the NDPA requirements, including ensuring the receiving country provides adequate protection or that appropriate contractual safeguards are in place.",
        },
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      blocks: [
        {
          p: "We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, as required by law, or as needed to resolve disputes and enforce our agreements. The following general periods apply:",
        },
        {
          table: {
            head: ["Category of Data", "Retention Period", "Reason"],
            rows: [
              ["Order history and transaction records", "7 years from date of transaction", "Nigerian tax and commercial law obligations"],
              ["Customer account data", "Duration of account + 2 years after deletion", "Dispute resolution; fraud prevention"],
              ["Payment transaction references", "7 years", "CBN and FIRS compliance"],
              ["Vendor and rider identity documents", "Duration of engagement + 3 years", "Regulatory compliance; potential claims"],
              ["Marketing consent records", "Until consent withdrawn + 1 year", "Proof of lawful processing"],
              ["WhatsApp chat logs", "12 months from last interaction", "Service improvement; dispute resolution"],
              ["Device and usage/analytics data", "12 months", "Analytics; service improvement"],
              ["Data subject rights requests and responses", "5 years", "Regulatory audit trail"],
            ],
          },
        },
        {
          p: "Upon expiry of the applicable retention period, personal data will be securely deleted or anonymised such that it can no longer be associated with you. We will not retain data solely on the basis that it may conceivably become useful in the future.",
        },
        {
          p: "You may request earlier deletion of your data in accordance with Section 6 of this Policy, subject to our legal retention obligations.",
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights Under the NDPR",
      blocks: [
        {
          p: "Under the Nigeria Data Protection Regulation 2019 and the Nigeria Data Protection Act 2023, you have the following rights regarding your personal data:",
        },
        { h: "6.1 Right of Access" },
        {
          p: "You may request a copy of the personal data we hold about you and information about how we process it.",
        },
        { h: "6.2 Right to Rectification" },
        {
          p: "You may request that we correct inaccurate or incomplete personal data about you without undue delay.",
        },
        { h: "6.3 Right to Erasure (“Right to be Forgotten”)" },
        {
          p: "You may request deletion of your personal data where: (a) the data is no longer necessary for the purpose it was collected; (b) you withdraw consent and there is no other lawful basis; (c) the data has been unlawfully processed; or (d) deletion is required to comply with a legal obligation. We will honour erasure requests unless we are required or entitled by law to retain the data.",
        },
        { h: "6.4 Right to Restriction of Processing" },
        {
          p: "You may request that we restrict processing of your personal data in certain circumstances, for example while the accuracy of the data is contested.",
        },
        { h: "6.5 Right to Data Portability" },
        {
          p: "Where processing is based on consent or contract and carried out by automated means, you have the right to receive your personal data in a structured, commonly used, machine-readable format and to transmit that data to another controller.",
        },
        { h: "6.6 Right to Object" },
        {
          p: "You may object at any time to processing of your personal data that is based on our legitimate interests, including profiling. We will cease such processing unless we can demonstrate compelling legitimate grounds that override your interests.",
        },
        { h: "6.7 Right to Withdraw Consent" },
        {
          p: "Where we rely on your consent as the lawful basis for processing, you may withdraw that consent at any time. Withdrawal will not affect the lawfulness of processing before the withdrawal.",
        },
        { h: "6.8 How to Exercise Your Rights" },
        {
          title: "Submit a written request to legal@getrecommend.co",
          note: "We will respond within **30 days** of receiving a verifiable request. We may request identity verification before processing your request. There is no fee for exercising your rights unless a request is manifestly unfounded or excessive.",
        },
        { h: "6.9 Right to Lodge a Complaint" },
        {
          p: "If you believe we have violated your data protection rights, you have the right to lodge a complaint with the **Nigeria Data Protection Commission (NDPC)**:",
        },
        { list: ["Website: www.ndpc.gov.ng", "Email: info@ndpc.gov.ng"] },
        { p: "You may also seek civil redress through the courts of Nigeria." },
      ],
    },
    {
      id: "childrens-privacy",
      title: "Children’s Privacy",
      blocks: [
        {
          p: "Our Service is not directed at children under the age of 18. We do not knowingly collect or process personal data from individuals under 18 years of age.",
        },
        {
          p: "If you are a parent or legal guardian and you believe your child has provided us with personal data without your consent, please contact us immediately at legal@getrecommend.co. We will take prompt steps to delete such data from our systems.",
        },
        {
          p: "If we discover that we have inadvertently collected personal data from a child under 18, we will delete it without delay unless we are required by law to retain it.",
        },
        {
          p: "Vendors and riders must be aged 18 or over to register on the platform. By registering, you confirm that you are 18 years of age or older.",
        },
      ],
    },
    {
      id: "whatsapp-and-third-parties",
      title: "WhatsApp and Third-Party Platforms",
      blocks: [
        {
          p: "Recommend operates through WhatsApp Business, a platform owned and operated by Meta Platforms, Inc. By communicating with us through WhatsApp, you acknowledge and agree that:",
        },
        { h: "8.1 Meta Data Processing" },
        {
          p: "WhatsApp and Meta collect and process data about your messages and interactions in accordance with Meta’s own Privacy Policy and WhatsApp’s Privacy Policy. We have no control over and accept no responsibility for the data processing practices of Meta or WhatsApp. You are encouraged to review WhatsApp’s Privacy Policy at www.whatsapp.com/legal/privacy-policy.",
        },
        { h: "8.2 Message Content" },
        {
          p: "Messages you send through WhatsApp to Recommend are received and stored by us for the purpose of processing your orders and responding to your enquiries. We cannot guarantee the security of data in transit over WhatsApp’s infrastructure.",
        },
        { h: "8.3 WhatsApp Business API" },
        {
          p: "We use the WhatsApp Business API, provided by Meta or an authorised Business Solution Provider (BSP). Our BSP is bound by Meta’s partner terms and applicable data protection obligations.",
        },
        { h: "8.4 Other Third-Party Links" },
        {
          p: "Our Service may contain links to third-party websites, applications, or services. We are not responsible for the privacy practices of those third parties. We strongly encourage you to read the privacy policy of every third-party site or service you visit.",
        },
        { h: "8.5 Payment Platforms" },
        {
          p: "Payments are processed through third-party payment platforms. Their data practices are governed by their own privacy policies and are subject to CBN regulation. We are not responsible for data breaches or misuse by payment processors, provided we have taken reasonable steps to engage reputable, licensed processors.",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          p: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, accidental loss, destruction, or disclosure. These measures include:",
        },
        {
          list: [
            "Encryption of data in transit (TLS/SSL) and at rest where technically feasible;",
            "Access controls ensuring that only authorised personnel can access personal data, limited to what is necessary for their role;",
            "Regular review of our data handling practices and security procedures;",
            "Contractual obligations imposed on all data processors and sub-processors;",
            "Employee training on data protection obligations.",
          ],
        },
        { h: "9.1 Limitations" },
        {
          p: "No method of electronic transmission or storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security. In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify the Nigeria Data Protection Commission (NDPC) within 72 hours of becoming aware of the breach, and will notify affected individuals without undue delay in accordance with the NDPA.",
        },
        { h: "9.2 Your Responsibility" },
        {
          p: "You are responsible for keeping your WhatsApp account and any access credentials secure. Do not share your order confirmation codes, one-time passwords (OTPs), or any account credentials with anyone, including persons claiming to represent Recommend.",
        },
        {
          title: "We will never ask for these",
          note: "We will never ask you for your password, OTP, or full card details via WhatsApp or any other channel.",
        },
      ],
    },
    {
      id: "changes-to-this-policy",
      title: "Changes to This Policy",
      blocks: [
        {
          p: "We may update this Privacy Policy from time to time to reflect changes in our practices, applicable law, or the Service. When we make material changes, we will:",
        },
        {
          list: [
            "Update the “Last Updated” date at the top of this Policy;",
            "Notify registered users via WhatsApp message or email at least **14 days** before the changes take effect;",
            "Where required by law, obtain your consent before applying changes that materially affect how we process your personal data.",
          ],
        },
        {
          p: "Your continued use of the Service after the effective date of any revised Policy constitutes your acceptance of the changes. If you do not agree with a revised Policy, you must stop using the Service and may request deletion of your account.",
        },
        {
          p: "All previous versions of this Policy are archived and available upon request by contacting legal@getrecommend.co.",
        },
      ],
    },
    {
      id: "contact-and-complaints",
      title: "Contact and Complaints",
      blocks: [
        { h: "11.1 Contact Us" },
        {
          p: "For any questions, requests, or concerns regarding this Privacy Policy or our data practices, please contact our designated Data Protection Officer (DPO) or Privacy Contact:",
        },
        {
          list: [
            "**Email:** legal@getrecommend.co",
            "**Postal Address:** Brand Collaborator Limited, Lagos, Nigeria",
          ],
        },
        {
          p: "We will acknowledge your request within **5 business days** and endeavour to resolve it within **30 days**.",
        },
        { h: "11.2 Complaints to the NDPC" },
        {
          p: "If you are not satisfied with our response to a data protection concern, you have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC):",
        },
        {
          list: [
            "Website: www.ndpc.gov.ng",
            "Email: info@ndpc.gov.ng",
            "Address: No. 8 Bode Thomas Street, Surulere, Lagos / Abuja, Nigeria",
          ],
        },
        { h: "11.3 Mandatory Data Protection Compliance Notice" },
        {
          p: "In accordance with the NDPR, Brand Collaborator Limited has conducted a Data Protection Impact Assessment (DPIA) for high-risk processing activities and has filed the required Annual Data Protection Audit with a licensed Data Protection Compliance Organisation (DPCO) as mandated by the NDPA 2023.",
        },
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of Liability",
      blocks: [
        { h: "12.1 Liability Cap" },
        {
          p: "To the maximum extent permitted by applicable Nigerian law, the total aggregate liability of Brand Collaborator Limited, its directors, officers, employees, agents, and assigns arising out of or in connection with this Privacy Policy or the processing of your personal data shall not exceed the greater of:",
        },
        {
          list: [
            "The value of the single transaction or order to which the claim relates; or",
            "Ten Thousand Naira (NGN 10,000)",
          ],
        },
        { p: "whichever is lower." },
        { h: "12.2 Exclusion of Consequential Loss" },
        {
          p: "Brand Collaborator Limited shall not be liable — whether in contract, tort (including negligence), breach of statutory duty, or otherwise — for any:",
        },
        {
          list: [
            "Loss of profit, revenue, or anticipated savings;",
            "Loss of business, contracts, or goodwill;",
            "Loss of data or corruption of data (beyond the obligations set out in Section 9);",
            "Indirect, incidental, special, punitive, or consequential loss or damage;",
          ],
        },
        {
          p: "arising out of or in connection with this Privacy Policy or the use of the Service, even if we have been advised of the possibility of such losses.",
        },
        { h: "12.3 Third-Party Platforms" },
        { p: "We are not liable for the data practices, security incidents, outages, or privacy failures of:" },
        {
          list: [
            "Meta Platforms Inc. (WhatsApp, Instagram, Facebook);",
            "Payment processors (Paystack, Flutterwave, or any other payment gateway);",
            "Logistics and dispatch partners (including but not limited to Whoosh NG and Legbegbe);",
            "Any other third-party service, API, or platform integrated with or accessible through the Service.",
          ],
        },
        {
          p: "Your use of those platforms is governed by their own terms and privacy policies. We disclaim all liability arising from your interactions with such platforms.",
        },
        { h: "12.4 User Indemnification" },
        {
          p: "You agree to indemnify, defend, and hold harmless Brand Collaborator Limited and its directors, officers, employees, and agents from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in connection with:",
        },
        {
          list: [
            "Your breach of this Privacy Policy or our Terms of Service;",
            "Your misuse of the Service or submission of false, inaccurate, or misleading information;",
            "Any violation by you of applicable law, including the NDPR and NDPA 2023;",
            "Any claim by a third party arising from data you shared through the Service about another person without their consent.",
          ],
        },
        { h: "12.5 Force Majeure" },
        {
          p: "We shall not be in breach of this Privacy Policy nor liable for any failure or delay in our obligations under this Policy where such failure or delay results from any cause beyond our reasonable control, including but not limited to: acts of God, telecommunications failures, internet outages, cyberattacks by third parties, government action, regulatory directives, civil unrest, or national emergencies. In such circumstances, our obligations are suspended for the duration of the event, and we will use reasonable endeavours to resume normal operations as soon as practicable.",
        },
        { h: "12.6 No Waiver" },
        {
          p: "No failure or delay by us in exercising any right or remedy under this Policy shall constitute a waiver of that right or remedy. A waiver of any breach of this Policy shall not constitute a waiver of any subsequent breach.",
        },
        { h: "12.7 Severability" },
        {
          p: "If any provision of this Privacy Policy is found by a court or regulatory authority of competent jurisdiction to be invalid, unlawful, or unenforceable, that provision shall be deemed severed from the Policy. The remaining provisions shall continue in full force and effect to the maximum extent permitted by law.",
        },
        { h: "12.8 Entire Agreement" },
        {
          p: "This Privacy Policy, together with our Terms of Service and any other policies published on our website or communicated through the Service, constitutes the entire agreement between you and Brand Collaborator Limited regarding the collection, use, and protection of your personal data, and supersedes all prior representations, understandings, or agreements on that subject.",
        },
      ],
    },
  ],
};
