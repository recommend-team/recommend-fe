import type { LegalDoc } from "./types";

/** Recommend Terms of Use, v2 — 8 October 2026. Wording as supplied; do not paraphrase. */
export const TERMS: LegalDoc = {
  eyebrow: "TERMS OF USE",
  title: "Terms of Use",
  summary:
    "The agreement between you and Recommend: how the platform works, payments and refunds, delivery, and the rules that apply to buyers and vendors.",
  lastUpdated: "8 October 2026",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      blocks: [
        {
          p: "These Terms of Use (“Terms”) constitute a legally binding agreement between you and **Brand Collaborator Limited**, a company incorporated under the laws of the Federal Republic of Nigeria (trading as **Recommend**, “we”, “us” or “our”), with its principal place of business in Lagos, Nigeria.",
        },
        {
          p: "By accessing or using the Recommend platform — whether through WhatsApp, our website at getrecommend.co, any mobile application, or any other channel through which the Service is made available (collectively, the “Service”) — you confirm that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy, which is incorporated herein by reference.",
        },
        { p: "If you do not agree to these Terms, you must immediately cease using the Service." },
        { p: "**These Terms govern all users of the Service, including:**" },
        {
          list: [
            "Buyers (consumers who place orders through the Service)",
            "Vendors (merchants, restaurants, shops, and other businesses that list products or services on the Service)",
            "Any other person who accesses or uses the Service in any capacity",
          ],
        },
        {
          title: "Governing Law",
          note: "These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, including the Federal Competition and Consumer Protection Act (FCCPA) 2018, the Consumer Protection Council Act, the Central Bank of Nigeria (CBN) regulations, and all applicable subsidiary legislation. Any dispute arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.",
        },
      ],
    },
    {
      id: "platform-and-eligibility",
      title: "Platform Description and Eligibility",
      blocks: [
        { h: "2.1 What Recommend Does" },
        {
          p: "Recommend is a technology-enabled marketplace and order facilitation platform that connects buyers with independent vendors (including food vendors, grocery stores, pharmacies, and other merchants) and facilitates the arrangement of delivery through independent third-party logistics partners. Recommend does not itself sell goods, prepare food, dispense medicine, or operate delivery vehicles. We are a platform intermediary only.",
        },
        { h: "2.2 Eligibility" },
        { p: "To use the Service, you must:" },
        {
          list: [
            "Be at least **18 years of age**, or the age of majority in your jurisdiction if higher;",
            "Have the legal capacity to enter into a binding contract under Nigerian law;",
            "Not be barred from using the Service under any applicable law;",
            "For vendors: hold all licences, permits, and regulatory approvals required to sell the products or services you list.",
          ],
        },
        {
          p: "By using the Service, you represent and warrant that you meet all of the above requirements. We reserve the right to suspend or terminate your access if we discover that any representation is false.",
        },
        { h: "2.3 Account Registration" },
        {
          p: "Certain features of the Service require you to register an account or interact through a verified WhatsApp number. You agree to:",
        },
        {
          list: [
            "Provide accurate, current, and complete information;",
            "Maintain the security of your account credentials and WhatsApp access;",
            "Notify us immediately at legal@getrecommend.co of any unauthorised use of your account;",
            "Accept full responsibility for all activity conducted through your account.",
          ],
        },
        {
          p: "We reserve the right to refuse registration, suspend, or terminate any account at our sole discretion, without notice or liability.",
        },
      ],
    },
    {
      id: "independent-contractors",
      title: "Independent Contractor Status — No Employment Relationship",
      blocks: [
        { h: "3.1 No Employment by Recommend" },
        {
          p: "Recommend does not employ, engage, or contract any rider, delivery operative, vendor, merchant, or any other individual or entity operating on or through the Service. **No person operating on the Recommend platform is an employee, agent, partner, or joint venturer of Brand Collaborator Limited.** This includes, without limitation:",
        },
        {
          list: [
            "Dispatch riders and delivery operatives;",
            "Vendors, merchants, restaurants, and shop owners;",
            "Any person performing any service facilitated through the platform.",
          ],
        },
        { h: "3.2 Vendors Are Independent Merchants" },
        {
          p: "All vendors on the platform operate as independent businesses. Recommend provides technology infrastructure and order routing; it does not direct, supervise, or control how vendors prepare, package, or price their products. Vendors are solely responsible for the quality, safety, accuracy, and legality of the goods and services they list and sell.",
        },
        { h: "3.3 Riders Are Employed by Licensed Logistics Partners" },
        {
          p: "All dispatch riders and delivery operatives who fulfil orders placed through the Service are employed by, or engaged as independent contractors of, our third-party logistics partners (“Logistics Partners”). Recommend does not:",
        },
        {
          list: [
            "Employ, hire, or recruit any rider;",
            "Pay any rider a salary, wage, monthly retainer, or any other form of personal remuneration;",
            "Direct, supervise, or control the day-to-day activities of any rider;",
            "Provide insurance, pension, healthcare, or any other employment benefit to any rider.",
          ],
        },
        {
          p: "Payments for logistics services are made by Recommend to the Logistics Partner as a company, in accordance with the commercial agreement between Recommend and that Logistics Partner. The welfare, safety, remuneration, insurance, and all employment obligations towards riders rest exclusively with the Logistics Partner that employs or engages them.",
        },
        { h: "3.4 No Liability for Contractor Acts" },
        {
          p: "Recommend accepts no liability whatsoever for the acts, omissions, negligence, misconduct, or default of any vendor, rider, or logistics partner, whether occurring during order fulfilment or otherwise. Any claim arising from the conduct of a vendor or rider must be directed to that party or their employer.",
        },
      ],
    },
    {
      id: "payment-terms",
      title: "Payment Terms",
      blocks: [
        { h: "4.1 Vendor Payment Cycle" },
        {
          p: "Vendors will receive settlement of proceeds from completed orders within **24 hours of confirmed delivery** of the relevant order, subject to clauses 4.2 and 4.3 below. “Confirmed delivery” means the point at which the logistics partner records or confirms successful delivery to the buyer, or such other confirmation mechanism as Recommend adopts from time to time.",
        },
        { h: "4.2 Payment Processing" },
        {
          p: "All payments are processed through one or more third-party payment processors or financial technology platforms (“Payment Processors”) engaged by Recommend, including but not limited to Paystack, Flutterwave, or any CBN-licensed payment service provider. Recommend is **not a payment service provider, bank, or financial institution**, and does not hold, store, or manage funds on behalf of vendors or buyers beyond what is strictly necessary to route the transaction through the Payment Processor.",
        },
        { h: "4.3 Payment Delays" },
        {
          p: "While Recommend commits to initiating vendor settlements within the 24-hour window, delays beyond our control may occur, including but not limited to:",
        },
        {
          list: [
            "Technical outages or settlement delays on the Payment Processor’s platform;",
            "Bank holiday or inter-bank clearing delays;",
            "Compliance holds imposed by the Payment Processor or any regulatory body;",
            "Network or telecommunications failures.",
          ],
        },
        {
          p: "In all such cases, Recommend will use reasonable endeavours to resolve the delay as quickly as practicable, and **the vendor will receive their payment in full once the delay is resolved**. Recommend shall not be liable for any loss, damage, or consequential harm arising from a payment delay caused by a third-party Payment Processor.",
        },
        { h: "4.4 Dispute Over Payment" },
        {
          p: "Any dispute regarding the amount or timing of a vendor payment must be raised with Recommend in writing at legal@getrecommend.co within **7 days** of the expected settlement date. Failure to raise a dispute within this period constitutes acceptance of the settlement amount recorded by Recommend’s systems.",
        },
      ],
    },
    {
      id: "refunds-and-cancellations",
      title: "Refund, Cancellation, and Returns Policy",
      blocks: [
        { h: "5.1 No Cancellation After Delivery Confirmation" },
        {
          p: "Once a buyer confirms receipt of an order — whether by explicit confirmation through the Recommend platform or WhatsApp, or by the passage of the 24-hour post-delivery window without raising a dispute — **the transaction is final and no cancellation, return, or refund will be processed.** A buyer who confirms receipt acknowledges that the order was received and accepts the goods as delivered.",
        },
        {
          note: "Buyers may cancel an order **only before the order has been collected by a rider or dispatched by the vendor.** Once an order is in transit, cancellation is not permitted under any circumstances.",
        },
        { h: "5.2 Eligible Refund Grounds" },
        {
          p: "A refund request will only be considered where the buyer submits a claim within **24 hours of confirmed delivery** and can demonstrate one or more of the following:",
        },
        {
          list: [
            "The order was not delivered at all;",
            "The items delivered were materially and verifiably different from what was ordered;",
            "The items were damaged, spoiled, or unfit for use **at the point of delivery** — not after the buyer has received, used, handled, or stored them;",
            "The order was materially incomplete.",
          ],
        },
        {
          p: "Disputes about quality, condition, or accuracy of items that arise after the buyer has accepted and used the goods will not be considered.",
        },
        { h: "5.3 Evidence Requirements by Product Category" },
        {
          p: "All refund claims must be supported by contemporaneous photographic or video evidence submitted at the time of the claim:",
        },
        {
          list: [
            "**Food and perishables:** Photograph taken immediately upon delivery showing the defect, spoilage, or discrepancy, submitted within 2 hours of delivery;",
            "**Clothing, fashion, and non-perishables:** Photograph or short video showing the item received alongside the original order description demonstrating a clear material difference. Wear, wash, or use of the item after delivery disqualifies the claim;",
            "**Groceries:** Photograph of delivered items against the order receipt showing missing or incorrect items;",
            "**Medicine and pharmaceutical products:** See Section 5.7 — a separate and stricter regime applies.",
          ],
        },
        {
          p: "Absence of contemporaneous evidence at the time of the claim shall be grounds to deny the claim at Recommend’s sole discretion.",
        },
        { h: "5.4 Rider and Vendor Dispatch Confirmation as Exonerating Evidence" },
        {
          p: "Where a buyer claims an item was damaged or incorrect, Recommend may request confirmation from the assigned rider and the vendor regarding the item’s condition at dispatch and handover.",
        },
        {
          p: "Where both the rider and vendor confirm that the item was in satisfactory condition and correctly packaged at dispatch, **such confirmation constitutes prima facie evidence that the item was dispatched correctly and in undamaged condition.** In the absence of contemporaneous photographic evidence to the contrary submitted by the buyer at or immediately upon delivery, a later claim of damage or wrong item **shall be denied.**",
        },
        {
          p: "Recommend’s determination on such disputes, made in good faith on the evidence available, shall be final and binding on all parties.",
        },
        { h: "5.5 How to Request a Refund" },
        {
          p: "Refund requests must be submitted by the buyer via the Recommend WhatsApp channel or by emailing legal@getrecommend.co within the 24-hour window, including:",
        },
        {
          list: [
            "The order reference number;",
            "A clear description of the issue;",
            "Photographic or video evidence as required under clause 5.3.",
          ],
        },
        {
          p: "Recommend will assess all valid requests and, where approved, process the refund within **5 business days** of approval to the original payment method.",
        },
        { h: "5.6 Refund Recovered from Vendor" },
        {
          p: "Where a refund is approved due to vendor fault, Recommend reserves the right to recover the refund amount from the vendor’s pending settlement by way of set-off, without prior notice.",
        },
        { h: "5.7 Pharmaceutical and Medicine Returns — Strict No-Return Policy" },
        {
          p: "Due to the nature of pharmaceutical products and the public health risks associated with their return, **all sales of medicine, drugs, supplements, and pharmaceutical products are final.** No returns, exchanges, or refunds will be accepted for any pharmaceutical product once delivered, under any circumstances, except where the product was not delivered at all. See also Section 13 (Pharmaceutical and Medical Liability Disclaimer).",
        },
        { h: "5.8 Items Excluded from Refund" },
        { p: "The following will not be considered for refund under any circumstances:" },
        {
          list: [
            "Change of mind after order placement or after delivery confirmation;",
            "Buyer error in placing the order (wrong item, wrong address, wrong quantity);",
            "Dissatisfaction with a product that matches its listing description;",
            "Items damaged after delivery due to buyer handling, storage, or use;",
            "Delays caused by the logistics partner, traffic, weather, or other external factors;",
            "Perishable items delivered in satisfactory condition but not consumed promptly;",
            "Any pharmaceutical or medicine product (see 5.7).",
          ],
        },
        { h: "5.9 Consumer Rights Preserved" },
        {
          p: "Nothing in this Section limits a buyer’s statutory rights under the Federal Competition and Consumer Protection Act (FCCPA) 2018 where those rights cannot lawfully be excluded.",
        },
      ],
    },
    {
      id: "logistics-and-delivery",
      title: "Logistics and Delivery",
      blocks: [
        { h: "6.1 Third-Party Logistics Partners" },
        {
          p: "All physical delivery services facilitated through the Recommend platform are carried out exclusively by independent, licensed third-party logistics companies (“Logistics Partners”). Recommend is **not a logistics company, courier, or transport operator**. We do not own, operate, or maintain any delivery vehicles, motorcycles, or other conveyances, and we do not directly employ or supervise any delivery operative.",
        },
        { h: "6.2 Recommend’s Role" },
        {
          p: "Recommend acts solely as a technology intermediary that routes delivery requests to Logistics Partners. We take reasonable commercial steps to:",
        },
        {
          list: [
            "Partner only with reputable, registered logistics companies;",
            "Communicate order details accurately to the Logistics Partner;",
            "Monitor order status and relay updates to buyers and vendors.",
          ],
        },
        {
          p: "However, this does not make Recommend responsible for the physical execution of any delivery.",
        },
        { h: "6.3 No Liability for Loss, Damage, or Delay in Delivery" },
        { p: "Recommend accepts **no liability** for:" },
        {
          list: [
            "Loss, theft, or destruction of any item during transit;",
            "Damage to items during collection, transit, or delivery;",
            "Delayed, incomplete, or failed delivery;",
            "Acts or omissions of any rider or delivery operative during the course of a delivery;",
            "Road accidents, injuries, or any incident involving a Logistics Partner’s rider or vehicle.",
          ],
        },
        {
          p: "Any claim arising from a delivery incident must be directed to the relevant Logistics Partner. Recommend will use reasonable endeavours to assist buyers and vendors in identifying the appropriate Logistics Partner for their claim, but assumes no financial liability therefor.",
        },
        { h: "6.4 Rider Safety and Welfare" },
        {
          p: "The safety, welfare, insurance, and occupational health of all riders is the sole responsibility of the Logistics Partner that employs or engages them. Recommend:",
        },
        {
          list: [
            "Does not provide or procure insurance for any rider;",
            "Is not responsible for any injury, illness, or death of a rider occurring in the course of a delivery;",
            "Is not party to any employment or engagement contract between a Logistics Partner and its riders.",
          ],
        },
        { h: "6.5 Order Protection Commitment" },
        {
          p: "Notwithstanding clauses 6.3 and 6.4, Recommend commits to taking reasonable steps to communicate and enforce packaging and handling standards with Logistics Partners to help protect the integrity of orders in transit. This commitment does not create or imply any legal liability on Recommend’s part for delivery failures.",
        },
      ],
    },
    {
      id: "payment-processing",
      title: "Payment Processing",
      blocks: [
        { h: "7.1 Recommend Is Not a Payment Company" },
        {
          p: "Recommend is a marketplace technology platform. We are **not licensed as a payment service provider, fintech company, mobile money operator, or financial institution** under the Central Bank of Nigeria Act, the Banks and Other Financial Institutions Act (BOFIA) 2020, or any other applicable legislation. Payment processing is carried out exclusively by CBN-licensed Payment Processors contracted by Recommend.",
        },
        { h: "7.2 Third-Party Processor Disclaimer" },
        { p: "By using the Service, you acknowledge and agree that:" },
        {
          list: [
            "Payment transactions are processed by third-party Payment Processors, and Recommend has no control over the internal operations, uptime, or compliance processes of those processors;",
            "Recommend does not guarantee uninterrupted, error-free payment processing;",
            "Any technical issue, delay, reversal, or failure arising on the Payment Processor’s systems is outside Recommend’s control and Recommend shall bear no liability therefor;",
            "Chargebacks, reversals, and fraud prevention holds are determined by the Payment Processor and/or the buyer’s bank, not by Recommend.",
          ],
        },
        { h: "7.3 Guaranteed Payment Commitment" },
        {
          p: "Notwithstanding any delay caused by a third-party Payment Processor, Recommend commits that all verified vendors with confirmed completed deliveries **will receive their full settlement**. Where a delay occurs, Recommend will:",
        },
        {
          list: [
            "Notify the affected vendor as soon as practicable;",
            "Provide an estimated resolution timeline;",
            "Initiate a manual settlement where the automated process has failed and the delay exceeds 72 hours.",
          ],
        },
        { h: "7.4 Buyer Payment Obligations" },
        {
          p: "Buyers are responsible for ensuring sufficient funds are available at the time of order placement. Recommend reserves the right to cancel any order where payment authorisation fails. Recommend does not offer credit, buy-now-pay-later, or instalment payment facilities unless separately announced in writing.",
        },
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of Liability",
      blocks: [
        { h: "8.1 Platform Intermediary Disclaimer" },
        {
          p: "Recommend is a technology marketplace intermediary. We do not prepare food, manufacture goods, dispense medicine, operate vehicles, or employ any person in the fulfilment of orders. Accordingly, **Recommend accepts no liability for the quality, safety, legality, or fitness for purpose of any product or service listed, sold, or delivered through the platform.**",
        },
        { h: "8.2 Liability Cap" },
        {
          p: "To the maximum extent permitted by applicable Nigerian law, the total aggregate liability of Brand Collaborator Limited, its directors, officers, employees, and agents, arising out of or related to any single transaction, order, or incident on the platform shall not exceed the **value of the specific order to which the claim relates**, or **Ten Thousand Naira (NGN 10,000)**, whichever is lower.",
        },
        { h: "8.3 Exclusion of Consequential Loss" },
        {
          p: "Recommend shall not be liable, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, for:",
        },
        {
          list: [
            "Loss of profit, income, or revenue;",
            "Loss of business, contracts, goodwill, or opportunity;",
            "Indirect, incidental, special, or consequential loss or damage;",
            "Physical injury, illness, or death caused by a product sold through the platform (claims lie against the vendor and/or logistics partner);",
            "Any loss arising from reliance on the platform’s availability, speed, or accuracy.",
          ],
        },
        { h: "8.4 User Indemnification" },
        {
          p: "You agree to indemnify, defend, and hold harmless Brand Collaborator Limited and its directors, officers, employees, and agents from and against any claims, liabilities, losses, damages, costs, and expenses (including legal fees) arising from:",
        },
        {
          list: [
            "Your breach of these Terms;",
            "Your violation of any applicable law or third-party right;",
            "False, inaccurate, or misleading information you provide through the Service;",
            "Any dispute between you and another user (buyer, vendor, rider, or logistics partner).",
          ],
        },
        { h: "8.5 Force Majeure" },
        {
          p: "Recommend shall not be liable for any failure or delay in performing its obligations under these Terms where such failure or delay is caused by circumstances beyond its reasonable control, including but not limited to: acts of God, power outages, internet or telecommunications failures, CBN or regulatory directives, government actions, civil unrest, epidemic, pandemic, or national emergencies. Recommend’s obligations are suspended for the duration of the force majeure event and resume as soon as practicable thereafter.",
        },
        { h: "8.6 No Warranty" },
        {
          p: "The Service is provided “as is” and “as available” without any warranty, express or implied, including any warranty of merchantability, fitness for a particular purpose, or non-infringement. Recommend does not warrant that the Service will be uninterrupted, error-free, or free from viruses or other harmful components.",
        },
      ],
    },
    {
      id: "vendor-terms",
      title: "Vendor Terms",
      blocks: [
        { h: "9.1 Marketplace Rules" },
        { p: "By listing products or services on the Recommend platform, vendors agree to:" },
        {
          list: [
            "Provide accurate, complete, and up-to-date product descriptions, prices, and availability;",
            "Fulfil all accepted orders promptly and to the standard described in their listing;",
            "Comply with all applicable Nigerian laws governing the sale of their products, including NAFDAC regulations for food and pharmaceutical products, CAC registration requirements, and any sector-specific licensing;",
            "Maintain appropriate hygiene, safety, and quality standards for any food or consumable product listed.",
          ],
        },
        { h: "9.2 Prohibited Listings" },
        { p: "Vendors must not list or sell through the platform:" },
        {
          list: [
            "Counterfeit, stolen, or unlicensed goods;",
            "Prescription medicines without appropriate regulatory approval and dispensing authority;",
            "Alcohol or tobacco without applicable licences;",
            "Any product whose sale is prohibited or restricted by Nigerian law;",
            "Any product misrepresented in its description, ingredients, or origin.",
          ],
        },
        { h: "9.3 Vendor Responsibility for Product Quality" },
        {
          p: "Vendors are solely and exclusively responsible for the quality, safety, freshness, accuracy, and legality of all products and services they list and sell. Recommend makes no representation and gives no warranty regarding any vendor’s products. Buyers’ primary recourse for product quality failures is against the vendor directly.",
        },
        { h: "9.4 Platform Fees and Commission" },
        {
          p: "Vendors agree to pay Recommend’s platform fees and commission as communicated in the vendor onboarding agreement or as updated by Recommend with reasonable notice. Recommend reserves the right to deduct applicable fees from vendor settlements before disbursement.",
        },
        { h: "9.5 Suspension and Removal" },
        { p: "Recommend reserves the right, at its sole discretion and without prior notice, to:" },
        {
          list: [
            "Suspend or permanently remove any vendor listing;",
            "Suspend or terminate a vendor’s access to the platform;",
            "Withhold settlement pending investigation of a complaint or suspected breach of these Terms.",
          ],
        },
        {
          p: "Vendors whose access is suspended or terminated may appeal by writing to legal@getrecommend.co within 14 days of notification.",
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property and Acceptable Use",
      blocks: [
        { h: "10.1 Recommend’s Intellectual Property" },
        {
          p: "All rights in and to the Recommend platform, including its name, logo, branding, software, design, text, graphics, and the “Recommend” trademark, are owned by or licensed to Brand Collaborator Limited. You may not use, copy, reproduce, or distribute any part of Recommend’s intellectual property without our prior written consent.",
        },
        { h: "10.2 User Content Licence" },
        {
          p: "By submitting any content through the Service (including product listings, reviews, images, or communications), you grant Recommend a non-exclusive, royalty-free, worldwide licence to use, display, reproduce, and distribute that content for the purposes of operating and promoting the Service. You warrant that you own or have the right to grant this licence and that the content does not infringe any third-party rights.",
        },
        { h: "10.3 Prohibited Use" },
        { p: "You must not use the Service to:" },
        {
          list: [
            "Engage in any fraudulent, deceptive, or misleading conduct;",
            "Scrape, harvest, or extract data from the platform by automated means;",
            "Introduce malware, viruses, or any harmful code;",
            "Circumvent any security, authentication, or access control feature;",
            "Harass, threaten, or abuse any other user, vendor, rider, or Recommend staff;",
            "Use the platform for any purpose that violates applicable Nigerian law.",
          ],
        },
      ],
    },
    {
      id: "dispute-resolution",
      title: "Dispute Resolution and Governing Law",
      blocks: [
        { h: "11.1 Informal Resolution" },
        {
          p: "If you have a dispute with Recommend, you agree to first contact us at legal@getrecommend.co and allow us 30 days to attempt to resolve the matter informally before commencing any formal legal proceedings.",
        },
        { h: "11.2 Governing Law" },
        {
          p: "These Terms and any dispute or claim arising out of or in connection with them (including non-contractual disputes) shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.",
        },
        { h: "11.3 Jurisdiction" },
        {
          p: "The parties irrevocably submit to the exclusive jurisdiction of the courts of Lagos State, Nigeria to settle any dispute or claim arising out of or in connection with these Terms.",
        },
        { h: "11.4 Consumer Rights Not Affected" },
        {
          p: "Nothing in this clause limits a buyer’s right to bring a complaint before the Federal Competition and Consumer Protection Commission (FCCPC) or any other competent Nigerian regulatory authority.",
        },
      ],
    },
    {
      id: "general-provisions",
      title: "General Provisions",
      blocks: [
        { h: "12.1 Amendments" },
        {
          p: "Recommend reserves the right to amend these Terms at any time. Where changes are material, we will notify users via WhatsApp or email at least **14 days** before the amended Terms take effect. Your continued use of the Service after the effective date constitutes acceptance of the revised Terms.",
        },
        { h: "12.2 Severability" },
        {
          p: "If any provision of these Terms is held to be invalid, unlawful, or unenforceable by a court of competent jurisdiction, that provision shall be severed, and the remaining provisions shall continue in full force and effect.",
        },
        { h: "12.3 No Waiver" },
        {
          p: "Failure by Recommend to enforce any provision of these Terms shall not constitute a waiver of the right to enforce that provision at any future time.",
        },
        { h: "12.4 Entire Agreement" },
        {
          p: "These Terms, together with our Privacy Policy and any vendor onboarding agreement, constitute the entire agreement between you and Recommend regarding your use of the Service and supersede all prior agreements, representations, and understandings.",
        },
        { h: "12.5 Assignment" },
        {
          p: "You may not assign or transfer any rights or obligations under these Terms without Recommend’s prior written consent. Recommend may assign its rights and obligations under these Terms at any time, including in the event of a corporate restructuring, merger, or acquisition.",
        },
        { h: "12.6 Contact" },
        { p: "For any questions, notices, or complaints relating to these Terms, please contact:" },
        {
          list: [
            "**Email:** legal@getrecommend.co",
            "**Website:** getrecommend.co",
            "**Company:** Brand Collaborator Limited (trading as Recommend), Lagos, Nigeria",
          ],
        },
      ],
    },
    {
      id: "pharmaceutical-products",
      title: "Pharmaceutical and Medical Products — Liability Disclaimer",
      blocks: [
        { h: "13.1 Platform Is Not a Pharmacy or Medical Authority" },
        {
          p: "Recommend is a technology marketplace platform. It is **not a pharmacy, medical practitioner, pharmacist, dispensary, or any form of licensed healthcare provider.** Recommend does not review, verify, assess, approve, or endorse any medicine, pharmaceutical product, supplement, or health-related product listed or sold through the platform.",
        },
        { h: "13.2 No Prescription Verification" },
        {
          p: "Recommend has no ability to verify whether any medicine or pharmaceutical product purchased through the platform is a prescription-only medicine (POM) or an over-the-counter (OTC) product under applicable NAFDAC regulations. Recommend does not require, review, verify, or retain any prescription in connection with any purchase. **The sole responsibility for ensuring that any pharmaceutical product is purchased and used with appropriate medical authorisation rests entirely with the buyer.**",
        },
        { h: "13.3 Assumption of Medical Authorisation" },
        {
          p: "By purchasing any medicine, pharmaceutical product, supplement, or health-related product through the platform, the buyer irrevocably represents and warrants that:",
        },
        {
          list: [
            "The purchase is made pursuant to the buyer’s own informed decision and, where applicable, on the advice of a duly licensed medical practitioner;",
            "The buyer is not purchasing the product for any purpose that is unlawful or contrary to the instructions or advice of a qualified medical professional;",
            "The buyer accepts full and sole responsibility for the use of any such product.",
          ],
        },
        {
          p: "**Recommend shall treat every purchase of a pharmaceutical product as having been made on the buyer’s own volition and at the buyer’s own medical risk, regardless of any claim to the contrary.**",
        },
        { h: "13.4 No Liability for Pharmaceutical Use, Misuse, or Adverse Outcomes" },
        {
          p: "To the fullest extent permitted by applicable Nigerian law, **Recommend accepts absolutely no liability** for any loss, harm, injury, illness, adverse reaction, death, or any other outcome arising from or in connection with:",
        },
        {
          list: [
            "The purchase, possession, use, or misuse of any medicine, drug, supplement, or pharmaceutical product purchased through the platform;",
            "The buyer’s failure to obtain or follow a valid medical prescription;",
            "Overdose, whether accidental or intentional, involving any pharmaceutical product purchased through the platform;",
            "Adverse drug reactions, contraindications, or drug interactions involving any pharmaceutical product;",
            "Self-medication, self-harm, or any form of intentional or unintentional injury involving a pharmaceutical product purchased through the platform;",
            "Any use of a pharmaceutical product for a purpose other than its stated or approved indication;",
            "Any harm resulting from the buyer’s failure to disclose relevant medical history to a qualified practitioner before purchase.",
          ],
        },
        {
          p: "This exclusion applies regardless of how the purchase was made, the nature of the product, or any claim that Recommend ought to have known the risk.",
        },
        { h: "13.5 Vendor Responsibility for Pharmaceutical Listings" },
        {
          p: "Vendors listing pharmaceutical or medicinal products on the platform warrant that they hold all necessary licences and regulatory approvals required under NAFDAC regulations and applicable Nigerian law to sell such products. Recommend does not and cannot guarantee that all pharmaceutical listings are lawfully listed or that vendors comply with their regulatory obligations. Vendors bear sole liability for any unlawful listing or dispensing of pharmaceutical products.",
        },
        { h: "13.6 Buyer Acknowledgement" },
        {
          p: "By placing an order for any pharmaceutical product through the platform, the buyer expressly acknowledges and agrees that:",
        },
        {
          list: [
            "They have read and understood this Section 13 in full;",
            "They are purchasing the product freely, voluntarily, and on the basis of their own informed decision;",
            "They have sought, or have had the opportunity to seek, medical advice before making the purchase;",
            "Recommend bears no responsibility whatsoever for any consequence of the purchase or use of the product;",
            "This disclaimer is a material term of these Terms without which Recommend would not make pharmaceutical products available on the platform.",
          ],
        },
        { h: "13.7 Emergency and Safety Notice" },
        {
          title: "If someone may be at risk",
          note: "If you or someone you know may be at risk of harm from any substance, please contact the nearest hospital or emergency service immediately. Recommend encourages all users to use pharmaceutical products responsibly and only as directed by a qualified medical professional.",
        },
      ],
    },
  ],
};
