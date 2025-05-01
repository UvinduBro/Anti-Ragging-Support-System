import { Link } from "wouter";

const LegalResources = () => {
  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-medium text-primary mb-4">Legal Resources</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Anti-Ragging Laws in Sri Lanka</h2>
            <p className="mb-3">Ragging is prohibited across educational institutions in Sri Lanka and is punishable under various laws:</p>
            
            <div className="border border-neutral-200 rounded-md overflow-hidden mb-4">
              <div className="bg-primary text-white p-3">
                <h3 className="font-medium">Prohibition of Ragging and Other Forms of Violence in Educational Institutions Act, No. 20 of 1998</h3>
              </div>
              <div className="p-4">
                <p className="mb-3">This is the primary legislation in Sri Lanka that specifically criminalizes ragging:</p>
                <ul className="list-disc pl-5 mb-3 space-y-1">
                  <li>Defines ragging as "any act causing, causing to cause, or compelling the student to do any act, which causes or is likely to cause physical or psychological injury or mental pain or fear"</li>
                  <li>Makes ragging a non-bailable offense punishable with rigorous imprisonment up to 10 years</li>
                  <li>Imposes compensation requirements for victims</li>
                  <li>Expulsion of offenders from educational institutions</li>
                </ul>
                <p className="text-sm">This law applies to all educational institutions across Sri Lanka and provides severe penalties for ragging-related offenses.</p>
              </div>
            </div>
            
            <div className="border border-neutral-200 rounded-md overflow-hidden mb-4">
              <div className="bg-primary text-white p-3">
                <h3 className="font-medium">Penal Code Provisions</h3>
              </div>
              <div className="p-4">
                <p>In addition to the specific anti-ragging law, offenders can be charged under various sections of the Sri Lankan Penal Code:</p>
                <ul className="mt-3 space-y-3">
                  <li>
                    <span className="font-medium">Section 314:</span>
                    <p className="text-sm">Criminal intimidation, including threatening to cause injury</p>
                  </li>
                  <li>
                    <span className="font-medium">Section 310-329:</span>
                    <p className="text-sm">Deals with causing hurt, grievous hurt, and assault</p>
                  </li>
                  <li>
                    <span className="font-medium">Section 308(a):</span>
                    <p className="text-sm">Extortion through threats of harm</p>
                  </li>
                  <li>
                    <span className="font-medium">Section 345:</span>
                    <p className="text-sm">Sexual harassment and assault</p>
                  </li>
                  <li>
                    <span className="font-medium">Section 296:</span>
                    <p className="text-sm">In extreme cases resulting in death, charges of culpable homicide</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border border-neutral-200 rounded-md overflow-hidden">
              <div className="bg-primary text-white p-3">
                <h3 className="font-medium">UGC Circular on Prevention of Ragging</h3>
              </div>
              <div className="p-4">
                <p className="mb-3">The University Grants Commission (UGC) of Sri Lanka has issued circulars requiring universities to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Form anti-ragging committees at all universities</li>
                  <li>Implement preventive measures including orientation programs</li>
                  <li>Set up 24/7 hotlines for reporting incidents</li>
                  <li>Take immediate action on complaints</li>
                  <li>Provide counseling services for victims</li>
                  <li>Submit regular reports on ragging incidents and prevention measures</li>
                </ul>
                <p className="mt-3 text-sm">These regulations are binding on all state universities and affiliated institutions in Sri Lanka.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Sri Lankan University Policies</h2>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-primary mb-2">University Anti-Ragging Policies</h3>
              <p className="mb-3">Sri Lankan universities maintain strict anti-ragging policies in line with UGC guidelines:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mandatory anti-ragging undertaking during registration</li>
                <li>Anti-ragging committees with faculty, administration, student, and parent representatives</li>
                <li>Regular monitoring of campus areas by security personnel and anti-ragging squads</li>
                <li>Dedicated hotlines for reporting incidents</li>
                <li>Immediate suspension pending investigation for accused students</li>
                <li>Expulsion and legal action against proven offenders</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-primary mb-2">Important Contact Numbers</h3>
              <ul className="mt-3 space-y-3">
                <li>
                  <span className="font-medium">UGC Anti-Ragging Hotline:</span>
                  <p className="text-sm">011-2695301 (Operating hours: 8:30 AM - 4:15 PM)</p>
                </li>
                <li>
                  <span className="font-medium">National Anti-Ragging Committee:</span>
                  <p className="text-sm">011-2674780</p>
                </li>
                <li>
                  <span className="font-medium">Police Emergency:</span>
                  <p className="text-sm">119</p>
                </li>
                <li>
                  <span className="font-medium">Human Rights Commission of Sri Lanka:</span>
                  <p className="text-sm">011-2505451</p>
                </li>
                <li>
                  <span className="font-medium">Legal Aid Commission:</span>
                  <p className="text-sm">011-2433618</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <Link href="/report" className="inline-block bg-secondary hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200">
              Report an Incident
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalResources;
