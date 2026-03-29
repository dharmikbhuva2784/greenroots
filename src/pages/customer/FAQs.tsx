import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our collection, add items to your cart, and proceed to checkout. You can pay via UPI, credit/debit card, or choose cash on delivery. Once your order is confirmed, you will receive an order confirmation email.',
    },
    {
      question: 'What is your delivery time?',
      answer: 'We deliver within 3-7 business days across India. Metro cities usually receive orders within 3-4 days. You can track your order status in the "My Orders" section of your profile.',
    },
    {
      question: 'How are the plants packaged for delivery?',
      answer: 'All plants are carefully packaged in eco-friendly materials to ensure they reach you in perfect condition. We use biodegradable packaging and secure the plants to prevent damage during transit.',
    },
    {
      question: 'What if my plant arrives damaged?',
      answer: 'We offer a 7-day live delivery guarantee. If your plant arrives damaged or unhealthy, please contact us within 7 days with photos, and we will arrange a free replacement or refund.',
    },
    {
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free shipping on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹49 is applicable.',
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 2 hours of placing them, or before they are confirmed for shipping. Once shipped, orders cannot be cancelled. Please contact us immediately if you need to make changes.',
    },
    {
      question: 'How do I care for my new plant?',
      answer: 'Each plant comes with detailed care instructions. Generally, most plants need bright indirect light, regular watering when the topsoil feels dry, and occasional fertilizing. Check the product page for specific care tips.',
    },
    {
      question: 'Do you offer plant replacements?',
      answer: 'Yes, if your plant dies within 15 days of delivery despite proper care, we offer a one-time replacement. Please contact our support team with photos and details.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI payments, all major credit and debit cards, net banking, and cash on delivery (COD) for eligible locations.',
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order status by visiting the "My Orders" section in your profile. We update the status at every step: Order Placed, Confirmed, Packed, Shipped, Out for Delivery, and Delivered.',
    },
    {
      question: 'Do you deliver to my location?',
      answer: 'We deliver to most locations across India. Enter your pincode at checkout to confirm delivery availability to your area.',
    },
    {
      question: 'What is your return policy?',
      answer: 'Due to the perishable nature of plants, we do not accept returns. However, we offer replacements for damaged or unhealthy plants within our guarantee period. For non-plant items like pots and compost, returns are accepted within 7 days if unused.',
    },
  ];

  return (
    <div className="bg-linen min-h-screen pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest/10 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-forest" />
              <span className="text-sm font-medium text-forest">FAQs</span>
            </div>
            <h1 className="heading-lg text-forest mb-4">Frequently Asked Questions</h1>
            <p className="body-lg text-warmbrown max-w-2xl mx-auto">
              Got questions? We have got answers. If you cannot find what you are looking for, 
              feel free to contact us.
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm border border-ivory-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-ivory-50 transition-colors"
                >
                  <span className="font-heading text-lg font-semibold text-forest pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-forest flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-warmbrown flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-warmbrown body-md leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-warmbrown mb-4">Still have questions?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:hello@greenroots.in"
                className="btn-primary"
              >
                Contact Support
              </a>
              <a 
                href="tel:+919876543210"
                className="btn-outline"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
