import React from 'react';
import { RxCross2 } from "react-icons/rx";

const TermAndCondition = ({ closeDropdown }) => {
  return (
    <div className="p-6 relative bg-gray-50 rounded-lg shadow-lg">
      <button onClick={closeDropdown} className="absolute text-black bg-white p-3 top-3 right-3 rounded-full">
        <RxCross2 />
      </button>
      <h2 className="text-2xl font-bold text-black mb-4">Termat dhe Kushtet</h2>
      <p className="mb-4 text-black">
        Mirë se vini! Ju lutemi lexoni me kujdes termat dhe kushtet më poshtë.
        Duke përdorur platformën tonë, ju pranoni të respektoni këto rregulla.
      </p>

      <h2 className="text-xl text-black font-semibold mb-2">1. Përdorimi i Platformës</h2>
      <p className="mb-4 text-black">
        1.1. Ju duhet të jepni informacion të saktë dhe të përditësuar kur
        regjistroheni. <br />
        1.2. Ju jeni përgjegjës për ruajtjen e sigurisë së llogarisë tuaj.
      </p>

      <h2 className="text-xl text-black font-semibold mb-2">2. Privatësia e të Dhënave</h2>
      <p className="mb-4 text-black">
        2.1. Të dhënat tuaja personale do të trajtohen sipas politikës sonë të
        privatësisë. <br />
        2.2. Ne mund të përdorim të dhënat tuaja për të përmirësuar shërbimet
        tona.
      </p>

      <h2 className="text-xl text-black font-semibold mb-2">3. Sjellja e Përdoruesit</h2>
      <p className="mb-4 text-black">
        3.1. Ju nuk duhet të përdorni platformën për qëllime të paligjshme ose
        mashtruese. <br />
        3.2. Çdo abuzim mund të rezultojë në pezullimin e llogarisë suaj.
      </p>

      <h2 className="text-xl text-black font-semibold mb-2">4. Modifikimet</h2>
      <p className="mb-4 text-black">
        4.1. Ne rezervojmë të drejtën për të ndryshuar këto terma në çdo kohë.
      </p>

      <p className="text-sm text-gray-600 mt-6">
        Duke vazhduar përdorimin e platformës, ju pranoni këto terma dhe
        kushte.
      </p>
    </div>
  );
};

export default TermAndCondition;