'use client';

import { useState, useEffect, ChangeEvent } from 'react';

// Nota: Questo componente è ottimizzato per l'uso come pagina Next.js
// con Tailwind CSS e si adatta alla stampa su un singolo foglio A4.
// L'obiettivo è un design pulito, moderno e funzionale.

interface PartsReplaced {
  description: string;
  quantity: number;
  unitPrice: number;
}

const CHECKBOX_OPTIONS = [
  'IN LABORATORIO',
  'C/O CLIENTE',
  'RIP. IN GARANZIA',
  'RIP. A CONTRATTO',
  'RIP. CON ADDEBITO',
  'IN CONTO ORDINE',
  'RIP. SENZA ADDEBITO',
  'RESO SENZA ADDEBITO'
];

const App = () => {
  const [formData, setFormData] = useState({
    date: '',
    cardNo: '',
    customer: '',
    types: '',
    brands: '',
    models: '',
    faultReported: '',
    faultFound: '',
    interventionDescription: '',
    totalHours: 1,
    kmTravelled: 0,
    hourlyCost: 0,
    kmCost: 0,
    signatures: {
      responsible: '',
      signatureDate: '',
      customerSignature: '',
    }
  });

  const [checkboxState, setCheckboxState] = useState<Record<string, boolean>>(
    CHECKBOX_OPTIONS.reduce((acc, option) => ({ ...acc, [option]: false }), {})
  );

  const [partsReplaced, setPartsReplaced] = useState<PartsReplaced[]>(
    Array.from({ length: 5 }, () => ({ description: '', quantity: 1, unitPrice: 0 }))
  );

  const [totals, setTotals] = useState({
    imponibile: 0,
    iva: 0,
    totalDocument: 0,
  });

  // Gestione dei cambiamenti nei campi di testo e numerici del form
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Gestione dei cambiamenti per le firme
  const handleSignatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [name]: value
      }
    }));
  };

  // Gestione dei cambiamenti per le checkbox
  const handleCheckboxChange = (option: string) => {
    setCheckboxState(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Gestione dei cambiamenti nelle parti sostituite
  const handlePartsChange = (index: number, field: keyof PartsReplaced, value: string) => {
    setPartsReplaced(prev => {
      const newParts = [...prev];
      newParts[index] = {
        ...newParts[index],
        [field]: field === 'description' ? value : parseFloat(value) || 0,
      };
      return newParts;
    });
  };

  // Calcolo totale ogni volta che i dati cambiano
  useEffect(() => {
    let partsTotal = partsReplaced.reduce((acc, part) => acc + (part.quantity * part.unitPrice), 0);
    let laborTotal = (formData.totalHours * formData.hourlyCost) + (formData.kmTravelled * formData.kmCost);
    let total = partsTotal + laborTotal;
    let iva = total * 0.22;
    let totalDocument = total + iva;

    setTotals({
      imponibile: total,
      iva: iva,
      totalDocument: totalDocument,
    });
  }, [formData, partsReplaced]);

  const primaryColor = '#1a237e';
  const lightGrayColor = '#f4f4f4';

  return (
    <div
      style={{
        '--dark-blue': primaryColor,
        fontFamily: 'Inter, sans-serif'
      } as React.CSSProperties}
      className={`flex justify-center bg-gray-100 min-h-screen print:bg-white`}
    >
      <div className={`w-[210mm] h-[297mm] p-4 bg-white border border-[${primaryColor}] rounded-lg shadow-xl print:border-none print:shadow-none print:w-auto print:min-h-auto print:mx-0 print:p-4`}>
        {/* Stili di stampa */}
        <style>{`
          @media print {
            body {
              background-color: white !important;
            }
            .container {
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              padding: 5mm !important;
            }
          }
        `}</style>
        
        {/* Header Section */}
        <div className="flex justify-between items-center pb-2 mb-2 border-b border-blue-900">
          <div className="flex items-center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF3WLeV5KU2XNmtWkbvTraGaKT5OA7DuseSw&s" alt="Pluriservice Solutions Logo" className="w-40 h-14 mr-4" />
          </div>
          <div className="text-right">
            <h1 className="text-base font-bold text-blue-900 whitespace-nowrap">SCHEDA DI ASSISTENZA TECNICA</h1>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex justify-between text-xs mb-2 items-center text-blue-900">
          <p className="text-[0.6rem] text-blue-900 leading-tight">
            via F.Santi, 22 | Z.I. Bassette 48123 Ravenna (RA) | ITALY <br/> www.pluriservice.it | +39 0544 456669
          </p>
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1">
              <label htmlFor="date" className="whitespace-nowrap font-semibold">Data:</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="border-b border-gray-400 px-1 py-0.5 text-center w-24" />
            </div>
            <div className="flex items-center space-x-1">
              <label htmlFor="cardNo" className="whitespace-nowrap font-semibold">Scheda N°:</label>
              <input type="text" id="cardNo" name="cardNo" value={formData.cardNo} onChange={handleInputChange} className="border-b border-gray-400 px-1 py-0.5 text-center w-16" />
            </div>
          </div>
        </div>

        <div className="w-full h-px my-2 bg-blue-900"></div>

        {/* Dati Tecnici Section */}
        <div className="grid grid-cols-2 gap-x-6 mb-2 text-blue-900 text-sm">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <label htmlFor="customer" className="font-bold whitespace-nowrap w-[70px]">CLIENTE:</label>
              <input type="text" id="customer" name="customer" value={formData.customer} onChange={handleInputChange} className="w-full border-b border-blue-900 outline-none" />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="types" className="font-bold whitespace-nowrap w-[70px]">TIPI:</label>
              <input type="text" id="types" name="types" value={formData.types} onChange={handleInputChange} className="w-full border-b border-blue-900 outline-none" />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="brands" className="font-bold whitespace-nowrap w-[70px]">MARCHE:</label>
              <input type="text" id="brands" name="brands" value={formData.brands} onChange={handleInputChange} className="w-full border-b border-blue-900 outline-none" />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="models" className="font-bold whitespace-nowrap w-[70px]">MODELLI:</label>
              <input type="text" id="models" name="models" value={formData.models} onChange={handleInputChange} className="w-full border-b border-blue-900 outline-none" />
            </div>
          </div>

          <div>
            <label className="font-bold text-blue-900 block mb-1">INTERVENTO EFFETTUATO:</label>
            <div className="grid grid-cols-2 gap-y-0.5 gap-x-2 text-xs">
              {CHECKBOX_OPTIONS.map(option => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option}
                    checked={checkboxState[option]}
                    onChange={() => handleCheckboxChange(option)}
                    className="form-checkbox h-3 w-3 text-blue-900 rounded-sm focus:ring-0"
                  />
                  <label htmlFor={option} className="pl-1">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-px my-2 bg-blue-900"></div>

        {/* Difetto Section */}
        <div className="grid grid-cols-2 gap-x-6 mb-2 text-blue-900 text-sm">
          <div className="p-1 border border-gray-400 rounded-md">
            <label htmlFor="faultReported" className="font-bold block">DIFETTO LAMENTATO</label>
            <textarea
              id="faultReported"
              name="faultReported"
              rows={2}
              value={formData.faultReported}
              onChange={handleInputChange}
              className="w-full mt-1 p-0.5 border-none bg-transparent outline-none resize-none"
            ></textarea>
          </div>
          <div className="p-1 border border-gray-400 rounded-md">
            <label htmlFor="faultFound" className="font-bold block">DIFETTO RISCONTRATO</label>
            <textarea
              id="faultFound"
              name="faultFound"
              rows={2}
              value={formData.faultFound}
              onChange={handleInputChange}
              className="w-full mt-1 p-0.5 border-none bg-transparent outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* Descrizione Intervento Section */}
        <div className="p-1 mb-2 border border-gray-400 rounded-md text-blue-900 text-sm">
          <label htmlFor="interventionDescription" className="font-bold block">DESCRIZIONE INTERVENTO</label>
          <textarea
            id="interventionDescription"
            name="interventionDescription"
            rows={4}
            value={formData.interventionDescription}
            onChange={handleInputChange}
            className="w-full mt-1 p-0.5 border-none bg-transparent outline-none resize-none"
          ></textarea>
        </div>
        
        <div className="w-full h-px my-2 bg-blue-900"></div>

        {/* Nuova sezione Costi - Layout compattato e moderno */}
        <div className="bg-blue-50 rounded-lg p-2 mb-2 shadow-sm border border-blue-100 text-blue-900">
          <h3 className="font-bold mb-2 text-sm">COSTI INTERVENTO</h3>
          <div className="flex flex-col space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <label htmlFor="totalHours" className="font-medium whitespace-nowrap">Tempo Totale Ore:</label>
              <select
                id="totalHours"
                name="totalHours"
                value={formData.totalHours}
                onChange={handleInputChange}
                className="w-10 px-1 py-0.5 border border-gray-300 rounded-sm text-center text-xs"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
              <span className="font-medium">Costo Orario (€/h):</span>
              <input
                type="number"
                id="hourlyCost"
                name="hourlyCost"
                value={formData.hourlyCost}
                onChange={handleInputChange}
                className="w-14 px-1 py-0.5 border border-gray-300 rounded-sm text-right text-xs"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="kmTravelled" className="font-medium whitespace-nowrap">Kilometri percorsi:</label>
              <input
                type="number"
                id="kmTravelled"
                name="kmTravelled"
                value={formData.kmTravelled}
                onChange={handleInputChange}
                className="w-10 px-1 py-0.5 border border-gray-300 rounded-sm text-center text-xs"
                min="0"
                step="0.01"
              />
              <span className="font-medium">Costo Kilometro (€/km):</span>
              <input
                type="number"
                id="kmCost"
                name="kmCost"
                value={formData.kmCost}
                onChange={handleInputChange}
                className="w-14 px-1 py-0.5 border border-gray-300 rounded-sm text-right text-xs"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
        
        <div className="w-full h-px my-2 bg-blue-900"></div>
        
        {/* Parti Sostituite Section */}
        <div className="bg-blue-50 rounded-lg p-2 mb-2 shadow-sm border border-blue-100 text-blue-900">
          <h3 className="font-bold mb-2 text-sm">PARTI SOSTITUITE</h3>
          <div className="grid grid-cols-3 md:grid-cols-[6fr_1fr_1fr] gap-x-2 text-xs">
            <div className="font-bold text-blue-900">DESCRIZIONE</div>
            <div className="font-bold text-blue-900 text-center">QUANTITÀ</div>
            <div className="font-bold text-blue-900 text-right">P. UNITARIO (€)</div>
            {partsReplaced.map((part, index) => (
              <div key={index} className="contents">
                <input
                  type="text"
                  value={part.description}
                  onChange={(e) => handlePartsChange(index, 'description', e.target.value)}
                  className="px-1 py-0.5 border-b border-blue-900 outline-none text-xs bg-transparent"
                />
                <div className="flex justify-center">
                  <input
                    type="number"
                    value={part.quantity}
                    onChange={(e) => handlePartsChange(index, 'quantity', e.target.value)}
                    className="w-10 px-1 py-0.5 border border-gray-300 rounded-sm text-center text-xs bg-white"
                    min="1"
                  />
                </div>
                <input
                  type="number"
                  value={part.unitPrice}
                  onChange={(e) => handlePartsChange(index, 'unitPrice', e.target.value)}
                  className="w-14 px-1 py-0.5 border border-gray-300 rounded-sm text-right text-xs bg-white"
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px my-2 bg-blue-900"></div>

        {/* Final Totals Section */}
        <div className="bg-blue-50 rounded-lg p-2 mb-2 shadow-sm border border-blue-100 text-blue-900">
          <h3 className="font-bold mb-2 text-sm">TOTALI DOCUMENTO</h3>
          <div className="grid grid-cols-3 gap-y-2 gap-x-6 text-blue-900">
            <div className="flex items-center justify-between sm:justify-start space-x-1">
              <p className="whitespace-nowrap font-bold text-blue-900 text-xs">Totale imponibile €</p>
              <input
                type="text"
                id="total-imponibile"
                value={totals.imponibile.toFixed(2)}
                readOnly
                className="w-20 text-right bg-white border border-gray-300 rounded-md py-0.5 px-1 text-xs"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-start space-x-1">
              <p className="whitespace-nowrap font-bold text-blue-900 text-xs">IVA €</p>
              <input
                type="text"
                id="iva"
                value={totals.iva.toFixed(2)}
                readOnly
                className="w-20 text-right bg-white border border-gray-300 rounded-md py-0.5 px-1 text-xs"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-start space-x-1">
              <p className="whitespace-nowrap font-bold text-blue-900 text-xs">Tot. Documento €</p>
              <input
                type="text"
                id="total-documento"
                value={totals.totalDocument.toFixed(2)}
                readOnly
                className="w-20 text-right bg-white border border-gray-300 rounded-md py-0.5 px-1 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-px my-2 bg-blue-900"></div>

        {/* Notes and Signatures Section */}
        <div className="mt-2 text-[0.6rem] leading-tight text-blue-900 mb-2">
          <p>
            Non si accettano reclami per eventuali danni subiti dalle apparecchiature dopo la consegna dal Laboratorio.
            È di esclusiva competenza del Laboratorio PLURISERVICE SOLUTIONS S.R.L. stabilire il tipo di difetto ed il tipo di intervento. Inoltre non si accettano resi e proposte se non autorizzati.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-y-2 gap-x-6 text-blue-900 text-sm">
          <div className="flex flex-col">
            <p className="font-bold">RESP. INTERVENTO</p>
            <input
              type="text"
              name="responsible"
              value={formData.signatures.responsible}
              onChange={handleSignatureChange}
              className="w-full border-b border-blue-900 mt-1 py-0.5 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-bold">DATA</p>
            <input
              type="date"
              name="signatureDate"
              value={formData.signatures.signatureDate}
              onChange={handleSignatureChange}
              className="w-24 border-b border-blue-900 mt-1 py-0.5 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-bold">FIRMA PER CONVALIDA</p>
            <input
              type="text"
              name="customerSignature"
              value={formData.signatures.customerSignature}
              onChange={handleSignatureChange}
              className="w-full border-b border-blue-900 mt-1 py-0.5 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
