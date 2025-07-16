import FAQCard from "./FAQCard";

const FAQSection = () => (
  <section
    id="faq"
   className="bg-white pt-28 pb-14 px-4 md:pt-32 md:pb-18 md:px-16 max-w-4xl mx-auto mt-8">
    <h2 className="text-3xl font-bold text-center mb-8">
      Frequently Asked Questions
    </h2>
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      <FAQCard
        question="How secure is CardSmart?"
        answer="CardSmart uses bank-level encryption and does not store your card details on public servers."
      />
      <FAQCard
        question="Can I use CardSmart for free?"
        answer="Yes, CardSmart offers a free plan with all essential features. Premium plans are available for advanced users."
      />
      <FAQCard
        question="How do I delete my account?"
        answer="You can delete your account from the dashboard settings at any time."
      />
    </div>
  </section>
);

export default FAQSection;
