import React, { useState } from "react";

function App() {
  const [trend, setTrend] = useState("");
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedBrands, setSavedBrands] = useState([]);

  const generate = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (!trend.trim()) {
        setError("Veuillez entrer une tendance.");
        setLoading(false);
        return;
      }

      setBrand({
        name: trend + "™",
        slogan: "L'essence de " + trend + ", capturée.",
        description: "Une marque avant-gardiste fondée sur la tendance " + trend + ".",
        imagePrompt: `Logo futuriste pour "${trend}"`,
        imageUrl: "https://via.placeholder.com/600x300.png?text=" + encodeURIComponent(trend)
      });

      setLoading(false);
    }, 1000);
  };

  const regenerateImage = () => {
    if (!brand) return;
    setBrand((prev) => ({
      ...prev,
      imageUrl: "https://via.placeholder.com/600x300.png?text=" + encodeURIComponent(trend) + "&r=" + Math.random()
    }));
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = brand.imageUrl;
    link.download = `${brand.name}.png`;
    link.click();
  };

  const exportPDF = () => {
    alert("Fonction d'export PDF à implémenter");
  };

  const saveBrand = () => {
    if (brand) {
      setSavedBrands([...savedBrands, brand]);
    }
  };

  return (
    <div className="container">
      <h1>🧠 NEUROBRAND</h1>
      <p>Génère une mini-marque à partir d'une tendance :</p>

      <input
        value={trend}
        onChange={(e) => setTrend(e.target.value)}
        placeholder="ex: goblincore, fembot"
      />

      <button onClick={generate} disabled={loading || !trend.trim()}>
        {loading ? '⏳ Génération...' : 'Créer une marque'}
      </button>

      {error && <p className="error">{error}</p>}

      {brand && (
        <div className="result-block">
          <h2>✨ Résultat</h2>
          <div className="brand-card">
            <h3 className="brand-name">{brand.name}</h3>
            <p className="brand-slogan">"{brand.slogan}"</p>
            <p className="brand-description">{brand.description}</p>
            {brand.imagePrompt && (
              <div className="image-placeholder">
                <p><strong>🖼️ Image IA suggérée :</strong></p>
                <p>{brand.imagePrompt}</p>
              </div>
            )}
            {brand.imageUrl ? (
              <div className="image-display">
                <img
                  src={brand.imageUrl}
                  alt="Généré par IA"
                  crossOrigin="anonymous"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    maxHeight: "500px",
                    objectFit: "contain"
                  }}
                />
                <div className="actions">
                  <button onClick={regenerateImage}>🔁 Regénérer l'image</button>
                  <button onClick={downloadImage}>📥 Télécharger l'image</button>
                </div>
              </div>
            ) : (
              <p className="image-placeholder">⚠️ Image IA non disponible.</p>
            )}
          </div>
          <div className="actions">
            <button onClick={exportPDF}>📄 Exporter en PDF</button>
            <button onClick={saveBrand}>💾 Sauvegarder</button>
          </div>
        </div>
      )}

      {savedBrands.length > 0 && (
        <div className="result-block">
          <h2>💾 Marques sauvegardées</h2>
          {savedBrands.map((b, i) => (
            <div key={i} className="brand-card">
              <h3 className="brand-name">{b.name}</h3>
              <p className="brand-slogan">"{b.slogan}"</p>
              <p className="brand-description">{b.description}</p>
              {b.imagePrompt && (
                <p className="image-placeholder">🖼️ {b.imagePrompt}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
