import { useState } from 'react';
import { dispatchWorkflow } from '../../utils/serverless.js';
import { getAllTfFamilies } from '../../db/queries/search.js';
import { useEffect } from 'react';

export default function FormA() {
  const [name, setName] = useState('');
  const [family, setFamily] = useState('');
  const [description, setDescription] = useState('');

  const [familyOptions, setFamilyOptions] = useState(['Loading...']);
  const [status, setStatus] = useState('');
  const [queries, setQueries] = useState({});
  const [numOfQueries, setNumOfQueries] = useState(0);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    // Fetch TF families when the component mounts
    getAllTfFamilies()
      .then((res) => {
        const families = res.map((row) => row);
        setFamilyOptions([{TF_family_id: 0, name: 'Select... '}, ...families]);        
      })
      .catch((err) => {
        console.error('Error fetching TF families:', err);
      });
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value;

    // Transform inputs to SQL queries

    if (action === 'save' && family !== 0) {
      const newQuery = `INSERT INTO core_tf (name, family_id, description) VALUES ('${name}', ${family}, '${description}');`;
      setQueries((prev) => {

        if (Object.values(prev).includes(newQuery)) {
          setStatus('This query already exists.');
          return prev;
        }

        const nextIndex = Object.keys(prev).length + 1;
        const newKey = `query${nextIndex}`;

        setNumOfQueries((prev) => prev + 1);
        return {...prev, [newKey]: newQuery}
        
    });
      setNumOfQueries((prev) => prev + 1);
    }
    
    if (action === 'send') {
      setStatus('Are you sure you want to send the data to the database?');
      setShowModal(true);
    }
  };

  const handleConfirmSend = async () => {
      try {
        const encodedQueries = btoa(JSON.stringify(queries));

        const res = await dispatchWorkflow({inputs: {queries: encodedQueries}});
        if (res.ok) {          
          setQueries({}); // Clear queries after sending
          setNumOfQueries(0); // Reset the number of queries
          setStatus('Your data has been sent to the database.');
        }
      } 
      catch (err) {
        setStatus('Something went wrong. Please try again.');
        console.error(err);
      }
      finally {
        setShowModal(false);
      }
  };

  const handleReset = () => {
    setName('');
    setFamily('');
    setDescription('');
    setQueries({});
    setNumOfQueries(0);
    setStatus('');
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2>TF FORM</h2>
      <label>Name: 
        <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
        />
      </label>
      <label>Family: 
        <select
            required
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            className="form-control"
        >
            {familyOptions.map((fam) => (                
                <option key={fam.TF_family_id} value={fam.TF_family_id}>
                    {fam.name}
                </option>
            ))}
        </select>
        </label>
      <label>Description: 
        <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
        />
      </label>
      
      <button type="submit" name="action" value="save" className="btn">+</button>
      <button disabled={numOfQueries === 0} type="submit" name="action" value="send" className="btn">Send to DATABASE</button>
      {numOfQueries > 0 && !showModal && (
        Object.entries(queries).map(([key, query]) => (
          <p key={key} className="text-gray-500">
            {query}
          </p>
        ))
      )}
      {status && <p className="text-green-500">{status}</p>}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-black/100 p-6 rounded shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto mx-4">
            <p className="mb-4 text-white">{status}</p>
            <div className="flex justify-end gap-2">
              <button
                className="btn"
                onClick={() => {
                  setShowModal(false);
                  setStatus('');
                }}
              >
                No
              </button>
              <button
                className="btn"
                onClick={handleConfirmSend}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="reset"
        className="btn"
        onClick={handleReset} // Opcional: cerrar modal si está abierto
      >
        Reset
      </button>

    </form>
  );
}
