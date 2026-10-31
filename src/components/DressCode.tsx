import React from 'react';

export const DressCode: React.FC = () => {
  return (
    <section className="invitation-dresscode relative py-12 px-6 text-center">
      <div className="max-w-md mx-auto relative flex flex-col items-center">
        <p className="personal-eyebrow">Attire Guideline</p>
        <h2 className="dresscode-heading font-display text-3xl md:text-5xl mb-6">
          Dress Code
        </h2>

        <div className="dresscode-details">
          <p className="dresscode-title-note">
            Black Formal ( Please Note )
          </p>
          <p className="dresscode-desc-line">
            For the ladies : Elegant Black Formal dress or evening gown
          </p>
          <p className="dresscode-desc-line">
            For the Gentleman : Black formal suit or tuxedo with Black shoes
          </p>
        </div>
      </div>
    </section>
  );
};
