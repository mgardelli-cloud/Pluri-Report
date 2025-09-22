import React from 'react';
import { createRoot } from 'react-dom/client';

// Il componente principale dell'applicazione
function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-[210mm] h-[297mm] overflow-hidden bg-white shadow-xl rounded-lg text-blue-900 p-8 flex flex-col font-sans">

        {/* Regole di stampa per rimuovere ombre e sfondo */}
        <style>
          {`
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body, html {
              margin: 0;
              padding: 0;
              background-color: transparent;
            }
            .no-print {
              display: none;
            }
            .a4-container {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 2cm;
              box-shadow: none;
              border-radius: 0;
            }
          }
          `}
        </style>

        {/* Intestazione */}
        <header className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Titolo del Documento</h1>
          <p className="text-sm italic">Sottotitolo descrittivo e compatto</p>
        </header>

        {/* Sezione principale del contenuto */}
        <section className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Blocco di testo a sinistra */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Introduzione</h2>
              <p className="text-sm leading-relaxed mb-4">
                Questa sezione è dedicata all'introduzione del documento. Il testo è formattato per essere pulito e facile da leggere, con un design compatto che sfrutta al meglio lo spazio. La tipografia è stata scelta per garantire la massima leggibilità.
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">Dettagli Chiave</h3>
              <ul className="list-disc list-inside text-sm leading-relaxed space-y-1">
                <li>Layout ottimizzato per la stampa A4.</li>
                <li>Design pulito, moderno e minimale.</li>
                <li>Colore del testo: blu scuro (`#1a202c`).</li>
                <li>Uso intelligente degli spazi per la compattezza.</li>
                <li>Regole di stile specifiche per la stampa.</li>
              </ul>
            </div>

            {/* Blocco di testo a destra */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Corpo del Contenuto</h2>
              <p className="text-sm leading-relaxed mb-4">
                Qui puoi inserire il corpo principale del tuo documento. Il layout a colonne permette di organizzare le informazioni in modo logico e visivamente accattivante, evitando di appesantire il foglio.
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">Informazioni Aggiuntive</h3>
              <p className="text-sm leading-relaxed">
                Questo è un esempio di come il testo si distribuisce. La scelta di un font leggibile e la dimensione ridotta assicurano che il contenuto si adatti a un singolo foglio, mantenendo al contempo un aspetto professionale.
              </p>
            </div>
          </div>
        </section>

        {/* Piè di pagina */}
        <footer className="mt-8 text-center text-xs text-gray-500 no-print">
          <p>Documento generato per il design A4 - Tutti i diritti riservati</p>
        </footer>
      </div>
    </div>
  );
}

// Inizializzazione del rendering
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
