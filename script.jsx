import React, { useState, useEffect } from 'react';

export default function ExtensionGallery() {
  const [extensions, setExtensions] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the data from your extensions.json file dynamically
    fetch('extensions.json')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setExtensions(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching extensions:', error);
        setError(true);
        setIsLoading(false);
      });
  }, []); // The empty array ensures this only runs once when the component mounts

  if (isLoading) return <p style={{ textAlign: 'center' }}>Loading extensions...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>Failed to load extensions. Check extensions.json.</p>;

  return (
    <div className="gallery">
      {extensions.map((ext) => (
        <ExtensionCard key={ext.id} ext={ext} />
      ))}
    </div>
  );
}

function ExtensionCard({ ext }) {
  const [copyLinkLabel, setCopyLinkLabel] = useState('Copy Link');
  const [copyTextLabel, setCopyTextLabel] = useState('Copy Text');

  // Convert the relative file path into a full absolute URL based on where the site is hosted
  const absoluteFileUrl = new URL(ext.file, window.location.href).href;
  
  // Fallbacks for missing data
  const bannerSrc = ext.banner ? ext.banner : 'banners/unknown.png';
  const descriptionText = ext.description ? ext.description : 'No description provided.';
  const authorText = ext.author ? ext.author : 'Unknown';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(absoluteFileUrl).then(() => {
      setCopyLinkLabel('Copied Link!');
      setTimeout(() => setCopyLinkLabel('Copy Link'), 2000);
    });
  };

  const handleCopyText = async () => {
    setCopyTextLabel('Fetching...');
    try {
      const response = await fetch(ext.file);
      if (!response.ok) throw new Error('File not found');
      
      const codeText = await response.text();
      await navigator.clipboard.writeText(codeText);
      setCopyTextLabel('Text Copied!');
    } catch (error) {
      console.error('Failed to fetch and copy extension text:', error);
      setCopyTextLabel('Error!');
    }
    setTimeout(() => setCopyTextLabel('Copy Text'), 2000);
  };

  const handleTryChipywarp = () => {
    if (ext.unsandboxed) return; 
    
    const encodedUrl = encodeURIComponent(absoluteFileUrl);
    // Matches your requested chipywarp URL structure
    const targetUrl = `https://obeyorbehacked750-jpg.github.io/chipywarp-gui/editor.html?extension=${encodedUrl}`;
    
    window.open(targetUrl, '_blank');
  };

  // Visual disable styling for unsandboxed extensions
  const disabledStyle = ext.unsandboxed ? { opacity: 0.5, cursor: 'not-allowed' } : {};

  return (
    <div className="card">
      <img
        src={bannerSrc}
        alt={`${ext.name} Banner`}
        className="card-banner"
        onError={(e) => { e.currentTarget.src = 'banners/unknown.png'; }}
      />
      
      <div className="card-content">
        <div className="card-header-row">
          <h2 className="card-title">{ext.name}</h2>
          {ext.unsandboxed && (
            <img
              src="assets/unsandboxed.png"
              className="unsandboxed-icon"
              title="Unsandboxed extension!"
              alt="Unsandboxed"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </div>
        
        <p className="card-author">By {authorText}</p>
        <p className="card-description">{descriptionText}</p>

        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleCopyText}>
            <span>{copyTextLabel}</span>
          </button>

          <button className="btn btn-secondary" onClick={handleCopyLink}>
            <span>{copyLinkLabel}</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={handleTryChipywarp}
            disabled={ext.unsandboxed}
            style={disabledStyle}
            title={ext.unsandboxed ? 'Unsandboxed extensions cannot be tried directly.' : 'Test in Chipywarp'}
          >
            <span>Open Extension<span>
          </button>
        </div>
      </div>
    </div>
  );
}
