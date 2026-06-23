import { useEffect } from 'react';

const BottomAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div style={{ overflow: 'hidden', margin: '20px 0' }}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-6848970289929275"
           data-ad-slot="9908813011"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default BottomAd;