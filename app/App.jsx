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

export function App() {
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
    },
    partsReplaced: Array.from({ length: 5 }, () => ({ description: '', quantity: 1, unitPrice: 0 })) as PartsReplaced[],
    checkboxState: CHECKBOX_OPTIONS.reduce((acc, option) => ({ ...acc, [option]: false }), {} as Record<string, boolean>),
  });

  const [totals, setTotals] = useState({
    imponibile: 0,
    iva: 0,
    totalDocument: 0,
  });

  // Unificata gestione dei cambiamenti per tutti i campi
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = ['number', 'select-one'].includes(type) || ['totalHours', 'kmTravelled', 'hourlyCost', 'kmCost'].includes(name);

    if (name in formData.signatures) {
      setFormData(prev => ({
        ...prev,
        signatures: {
          ...prev.signatures,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: isNumber ? parseFloat(value) || 0 : value
      }));
    }
  };

  // Gestione dei cambiamenti per le checkbox
  const handleCheckboxChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      checkboxState: {
        ...prev.checkboxState,
        [option]: !prev.checkboxState[option]
      }
    }));
  };

  // Gestione dei cambiamenti nelle parti sostituite
  const handlePartsChange = (index: number, field: keyof PartsReplaced, value: string) => {
    setFormData(prev => {
      const newParts = [...prev.partsReplaced];
      newParts[index] = {
        ...newParts[index],
        [field]: field === 'description' ? value : parseFloat(value) || 0,
      };
      return {
        ...prev,
        partsReplaced: newParts,
      };
    });
  };

  // Calcolo totale ogni volta che i dati cambiano
  useEffect(() => {
    const partsTotal = formData.partsReplaced.reduce((acc, part) => acc + (part.quantity * part.unitPrice), 0);
    const laborTotal = (formData.totalHours * formData.hourlyCost) + (formData.kmTravelled * formData.kmCost);
    const total = partsTotal + laborTotal;
    const iva = total * 0.22;
    const totalDocument = total + iva;

    setTotals({
      imponibile: total,
      iva: iva,
      totalDocument: totalDocument,
    });
  }, [formData]);

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
      <div className={`w-[210mm] min-h-[297mm] p-6 bg-white border border-dark-blue rounded-lg shadow-xl print:border-none print:shadow-none print:w-auto print:min-h-auto print:mx-0 print:p-4`}>
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
        <div className="flex flex-col md:flex-row justify-between items-center pb-2 mb-2 border-b-2 border-dark-blue">
          <div className="flex items-center mb-2 md:mb-0">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF3WLeV5KU2XNmtWkbvTraGaKT5OA7DuseSw&s" alt="Pluriservice Solutions Logo" className="w-36 h-auto mr-4" />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-xl font-bold text-dark-blue whitespace-nowrap">SCHEDA DI ASSISTENZA TECNICA</h1>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col md:flex-row justify-between text-xs mb-2 items-center text-dark-blue">
          <p className="text-[0.6rem] text-dark-blue mb-2 md:mb-0">
            via F.Santi, 22 | Z.I. Bassette 48123 Ravenna (RA) | ITALY <br/> www.pluriservice.it | +39 0544 456669
          </p>
          <div className="flex flex-col md:flex-row items-center md:space-x-4">
            <div className="flex items-center space-x-2 mb-1 md:mb-0">
              <label htmlFor="date" className="whitespace-nowrap font-semibold">Data intervento:</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="border-b border-gray-400 px-2 py-1 text-center w-28" />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="cardNo" className="whitespace-nowrap font-semibold">Scheda N°:</label>
              <input type="text" id="cardNo" name="cardNo" value={formData.cardNo} onChange={handleInputChange} className="border-b border-gray-400 px-2 py-1 text-center w-20" />
            </div>
          </div>
        </div>

        <div className="w-full h-px my-2 bg-dark-blue"></div>

        {/* Dati Tecnici Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-2 text-dark-blue">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <label htmlFor="customer" className="font-bold whitespace-nowrap w-[70px]">CLIENTE:</label>
              <input type="text" id="customer" name="customer" value={formData.customer} onChange={handleInputChange} className="w-full border-b border-dark-blue outline-none" />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="types" className="font-bold whitespace-nowrap w-[70px]">TIPI:</label>
              <input type="text" id="types" name="types" value={formData.types} onChange={handleInputChange} className="w-full border-b border-dark-blue outline-none" />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="brands" className="font-bold whitespace-nowrap w-[70px]">MARCHE:</label>
              <input type="text" id="brands" name="brands" value={formData.brands} onChange={handleInputChange} className="w-full border-b border-dark-blue outline-none" />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="models" className="font-bold whitespace-nowrap w-[70px]">MODELLI:</label>
              <input type="text" id="models" name="models" value={formData.models} onChange={handleInputChange} className="w-full border-b border-dark-blue outline-none" />
            </div>
          </div>

          <div>
            <label className="font-bold text-dark-blue block mb-1">INTERVENTO EFFETTUATO:</label>
            <div className="grid grid-cols-2 gap-y-0.5 gap-x-4 text-xs">
              {CHECKBOX_OPTIONS.map(option => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option}
                    checked={formData.checkboxState[option]}
                    onChange={() => handleCheckboxChange(option)}
                    className="form-checkbox h-3 w-3 text-dark-blue rounded-sm focus:ring-0"
                  />
                  <label htmlFor={option} className="pl-2">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-px my-2 bg-dark-blue"></div>

        {/* Difetto Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-2 text-dark-blue">
          <div className="p-2 border border-gray-400 rounded-md mb-2 md:mb-0">
            <label htmlFor="faultReported" className="font-bold block">DIFETTO LAMENTATO</label>
            <textarea
              id="faultReported"
              name="faultReported"
              rows={3}
              value={formData.faultReported}
              onChange={handleInputChange}
              className="w-full mt-1 p-1 border-none bg-transparent outline-none resize-none"
            ></textarea>
          </div>
          <div className="p-2 border border-gray-400 rounded-md">
            <label htmlFor="faultFound" className="font-bold block">DIFETTO RISCONTRATO</label>
            <textarea
              id="faultFound"
              name="faultFound"
              rows={3}
              value={formData.faultFound}
              onChange={handleInputChange}
              className="w-full mt-1 p-1 border-none bg-transparent outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* Descrizione Intervento Section */}
        <div className="p-2 mb-2 border border-gray-400 rounded-md text-dark-blue">
          <label htmlFor="interventionDescription" className="font-bold block">DESCRIZIONE INTERVENTO</label>
          <textarea
            id="interventionDescription"
            name="interventionDescription"
            rows={5}
            value={formData.interventionDescription}
            onChange={handleInputChange}
            className="w-full mt-1 p-1 border-none bg-transparent outline-none resize-none"
          ></textarea>
        </div>
        
        <div className="w-full h-px my-2 bg-dark-blue"></div>

        {/* Costi Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-8 mb-2 text-dark-blue text-sm">
          <div className="flex-1 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="totalHours" className="whitespace-nowrap">Tempo Totale Ore:</label>
              <select
                id="totalHours"
                name="totalHours"
                value={formData.totalHours}
                onChange={handleInputChange}
                className="w-16 px-2 py-1 border border-gray-400 rounded-sm text-center text-xs"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="kmTravelled" className="whitespace-nowrap">Kilometri percorsi:</label>
              <input
                type="number"
                id="kmTravelled"
                name="kmTravelled"
                value={formData.kmTravelled}
                onChange={handleInputChange}
                className="w-16 px-2 py-1 border border-gray-400 rounded-sm text-right text-xs"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="hourlyCost" className="whitespace-nowrap">Costo Orario (€/h):</label>
              <input
                type="number"
                id="hourlyCost"
                name="hourlyCost"
                value={formData.hourlyCost}
                onChange={handleInputChange}
                className="w-16 px-2 py-1 border border-gray-400 rounded-sm text-right text-xs"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="kmCost" className="whitespace-nowrap">Costo Kilometro (€/km):</label>
              <input
                type="number"
                id="kmCost"
                name="kmCost"
                value={formData.kmCost}
                onChange={handleInputChange}
                className="w-16 px-2 py-1 border border-gray-400 rounded-sm text-right text-xs"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-px my-2 bg-dark-blue"></div>
        
        {/* Parti Sostituite Section */}
        <div className="mb-2 text-dark-blue">
          <label className="font-bold block mb-1">PARTI SOSTITUITE</label>
          <div className="grid grid-cols-3 md:grid-cols-[6fr_1fr_1fr] gap-x-2 text-xs">
            <div className="font-semibold text-dark-blue">DESCRIZIONE</div>
            <div className="font-semibold text-dark-blue text-center">QUANTITÀ</div>
            <div className="font-semibold text-dark-blue text-right">P. UNITARIO (€)</div>
            {formData.partsReplaced.map((part, index) => (
              <div key={index} className="contents">
                <input
                  type="text"
                  value={part.description}
                  onChange={(e) => handlePartsChange(index, 'description', e.target.value)}
                  className="px-2 py-1 border-b border-dark-blue outline-none text-xs"
                />
                <div className="flex justify-center">
                  <input
                    type="number"
                    value={part.quantity}
                    onChange={(e) => handlePartsChange(index, 'quantity', e.target.value)}
                    className="w-12 px-2 py-1 border border-gray-400 rounded-sm text-center text-xs"
                    min="1"
                  />
                </div>
                <input
                  type="number"
                  value={part.unitPrice}
                  onChange={(e) => handlePartsChange(index, 'unitPrice', e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-400 rounded-sm text-right text-xs"
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px my-2 bg-dark-blue"></div>

        {/* Final Totals Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-8 mb-2 text-dark-blue">
          <div className="flex items-center justify-between sm:justify-start space-x-2">
            <p className="whitespace-nowrap font-bold text-dark-blue">Totale imponibile €</p>
            <input
              type="text"
              id="total-imponibile"
              value={totals.imponibile.toFixed(2)}
              readOnly
              className="w-24 text-right bg-gray-100 border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <div className="flex items-center justify-between sm:justify-start space-x-2">
            <p className="whitespace-nowrap font-bold text-dark-blue">IVA €</p>
            <input
              type="text"
              id="iva"
              value={totals.iva.toFixed(2)}
              readOnly
              className="w-24 text-right bg-gray-100 border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <div className="flex items-center justify-between sm:justify-start space-x-2">
            <p className="whitespace-nowrap font-bold text-dark-blue">Tot. Documento €</p>
            <input
              type="text"
              id="total-documento"
              value={totals.totalDocument.toFixed(2)}
              readOnly
              className="w-24 text-right bg-gray-100 border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
        </div>

        <div className="w-full h-px my-2 bg-dark-blue"></div>

        {/* Notes and Signatures Section */}
        <div className="mt-2 text-xs leading-tight text-dark-blue mb-2">
          <p>
            Non si accettano reclami per eventuali danni subiti dalle apparecchiature dopo la consegna dal Laboratorio.
            È di esclusiva competenza del Laboratorio PLURISERVICE SOLUTIONS S.R.L. stabilire il tipo di difetto ed il tipo di intervento. Inoltre non si accettano resi e proposte se non autorizzati.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-8 text-dark-blue">
          <div className="flex flex-col">
            <p className="font-bold">RESP. INTERVENTO</p>
            <input
              type="text"
              name="responsible"
              value={formData.signatures.responsible}
              onChange={handleInputChange}
              className="w-full border-b border-dark-blue mt-1 py-1 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-bold">DATA</p>
            <input
              type="date"
              name="signatureDate"
              value={formData.signatures.signatureDate}
              onChange={handleInputChange}
              className="w-40 border-b border-dark-blue mt-1 py-1 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-bold">FIRMA PER CONVALIDA</p>
            <input
              type="text"
              name="customerSignature"
              value={formData.signatures.customerSignature}
              onChange={handleInputChange}
              className="w-full border-b border-dark-blue mt-1 py-1 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
