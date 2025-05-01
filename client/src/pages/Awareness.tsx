import { Link } from "wouter";

const Awareness = () => {
  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-medium text-primary mb-4">Ragging Awareness</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">What is Ragging?</h2>
            <p className="mb-3">Ragging refers to the act of teasing, threatening, or subjecting a student to humiliation or harassment - physical, verbal, or mental. It is often disguised as an initiation ritual but can cause severe psychological trauma and physical harm.</p>
            <p>The Supreme Court of India has defined ragging as "any disorderly conduct whether by words spoken or written or by an act which has the effect of teasing, treating or handling with rudeness a fresher or a junior student."</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Types of Ragging</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 border-pending p-3 bg-red-50">
                <h3 className="font-medium">Verbal Ragging</h3>
                <p className="text-sm">Includes teasing, mocking, verbal abuse, and forcing students to engage in inappropriate conversations.</p>
              </div>
              <div className="border-l-4 border-pending p-3 bg-red-50">
                <h3 className="font-medium">Physical Ragging</h3>
                <p className="text-sm">Involves physical abuse, forcing students to perform physical activities, or any form of bodily harm.</p>
              </div>
              <div className="border-l-4 border-pending p-3 bg-red-50">
                <h3 className="font-medium">Psychological Ragging</h3>
                <p className="text-sm">Creates mental pressure, fear, or anxiety through intimidation, isolation, or humiliation.</p>
              </div>
              <div className="border-l-4 border-pending p-3 bg-red-50">
                <h3 className="font-medium">Cyber Ragging</h3>
                <p className="text-sm">Using digital platforms to harass, threaten, or humiliate students through messages, social media, or other online means.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Impact of Ragging</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Psychological trauma and depression</li>
              <li>Academic performance deterioration</li>
              <li>Loss of self-confidence and self-esteem</li>
              <li>Physical injuries, sometimes severe</li>
              <li>In extreme cases, suicide or permanent psychological damage</li>
              <li>Damage to the educational environment</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Prevention Strategies</h2>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-primary mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Report any incident immediately</li>
                <li>Travel in groups, especially during initial weeks</li>
                <li>Keep in touch with family and trusted friends</li>
                <li>Be aware of anti-ragging policies and helplines</li>
                <li>Save emergency contact numbers</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-primary mb-2">For Institutions</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Establish anti-ragging committees and squads</li>
                <li>Conduct awareness programs and workshops</li>
                <li>Install CCTV cameras in vulnerable areas</li>
                <li>Implement strict disciplinary actions against offenders</li>
                <li>Provide counseling services</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/report" className="bg-secondary hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 text-center">
              Report an Incident
            </Link>
            <Link href="/legal" className="bg-white hover:bg-neutral-100 text-primary border border-primary font-medium py-2 px-6 rounded-md transition-colors duration-200 text-center">
              Legal Resources
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awareness;
