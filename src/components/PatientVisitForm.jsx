
import React, { useState, useEffect } from 'react';
import { 
  createPatientRecord, 
  getPatientRecords, 
  createPatientVisit, 
  getPatientVisits,
  updatePatientRecord,
  deletePatientRecord
} from '../services/authService'; // Assuming these are added to authService
import { useAuth } from '../contexts/AuthContext';

const PatientVisitForm = () => {
  const { user } = useAuth();
  const [patientRecords, setPatientRecords] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    patientName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    diagnosis: '',
    namasteCode: '',
    icd11Code: '',
    treatmentSummary: '',
    prescription: '',
    hospitalName: '',
    doctorName: '',
    doctorRegistration: '',
    reportDate: '',
    followUpDate: '',
    privacyConsent: false,
  });
  const [newVisitData, setNewVisitData] = useState({
    visitDate: '',
    reasonForVisit: '',
    diagnosis: '',
    namasteCode: '',
    icd11Code: '',
    treatment: '',
    prescription: '',
    notes: '',
    followUpRequired: false,
    followUpDate: '',
  });

  useEffect(() => {
    fetchPatientRecords();
  }, []);

  const fetchPatientRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPatientRecords();
      if (response.success) {
        setPatientRecords(response.data.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch patient records.');
      console.error('Error fetching patient records:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientVisits = async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPatientVisits(patientId);
      if (response.success) {
        setPatientVisits(response.data.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch patient visits.');
      console.error('Error fetching patient visits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPatientChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPatientData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewVisitChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVisitData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await createPatientRecord(newPatientData);
      if (response.success) {
        alert('Patient record created successfully!');
        setNewPatientData({
          patientName: '',
          age: '',
          gender: '',
          contactNumber: '',
          email: '',
          address: '',
          diagnosis: '',
          namasteCode: '',
          icd11Code: '',
          treatmentSummary: '',
          prescription: '',
          hospitalName: '',
          doctorName: '',
          doctorRegistration: '',
          reportDate: '',
          followUpDate: '',
          privacyConsent: false,
        });
        setShowPatientForm(false);
        fetchPatientRecords();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to create patient record.');
      console.error('Error creating patient record:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVisit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Please select a patient first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await createPatientVisit(selectedPatient.id, newVisitData);
      if (response.success) {
        alert('Patient visit created successfully!');
        setNewVisitData({
          visitDate: '',
          reasonForVisit: '',
          diagnosis: '',
          namasteCode: '',
          icd11Code: '',
          treatment: '',
          prescription: '',
          notes: '',
          followUpRequired: false,
          followUpDate: '',
        });
        setShowVisitForm(false);
        fetchPatientVisits(selectedPatient.id);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to create patient visit.');
      console.error('Error creating patient visit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    fetchPatientVisits(patient.id);
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient record and all associated visits?')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await deletePatientRecord(patientId);
      if (response.success) {
        alert('Patient record deleted successfully!');
        setSelectedPatient(null);
        setPatientVisits([]);
        fetchPatientRecords();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to delete patient record.');
      console.error('Error deleting patient record:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Management</h1>

      <button
        onClick={() => setShowPatientForm(!showPatientForm)}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showPatientForm ? 'Hide Patient Form' : 'Add New Patient'}
      </button>

      {showPatientForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Patient Record</h2>
          <form onSubmit={handleCreatePatient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="patientName" placeholder="Patient Name" value={newPatientData.patientName} onChange={handleNewPatientChange} className="p-2 border rounded" required />
            <input type="number" name="age" placeholder="Age" value={newPatientData.age} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <select name="gender" value={newPatientData.gender} onChange={handleNewPatientChange} className="p-2 border rounded">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" name="contactNumber" placeholder="Contact Number" value={newPatientData.contactNumber} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="email" name="email" placeholder="Email" value={newPatientData.email} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="address" placeholder="Address" value={newPatientData.address} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="diagnosis" placeholder="Diagnosis" value={newPatientData.diagnosis} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="namasteCode" placeholder="NAMASTE Code" value={newPatientData.namasteCode} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="icd11Code" placeholder="ICD-11 Code" value={newPatientData.icd11Code} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="treatmentSummary" placeholder="Treatment Summary" value={newPatientData.treatmentSummary} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="prescription" placeholder="Prescription" value={newPatientData.prescription} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="hospitalName" placeholder="Hospital Name" value={newPatientData.hospitalName} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="doctorName" placeholder="Doctor Name" value={newPatientData.doctorName} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <input type="text" name="doctorRegistration" placeholder="Doctor Registration" value={newPatientData.doctorRegistration} onChange={handleNewPatientChange} className="p-2 border rounded" />
            <label className="flex items-center gap-2">
              Report Date:
              <input type="date" name="reportDate" value={newPatientData.reportDate} onChange={handleNewPatientChange} className="p-2 border rounded" />
            </label>
            <label className="flex items-center gap-2">
              Follow Up Date:
              <input type="date" name="followUpDate" value={newPatientData.followUpDate} onChange={handleNewPatientChange} className="p-2 border rounded" />
            </label>
            <label className="flex items-center gap-2 col-span-full">
              <input type="checkbox" name="privacyConsent" checked={newPatientData.privacyConsent} onChange={handleNewPatientChange} />
              Privacy Consent
            </label>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded col-span-full">Create Patient</button>
          </form>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Patient Records</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {patientRecords.length === 0 ? (
          <p>No patient records found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {patientRecords.map((patient) => (
              <li key={patient.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{patient.patient_name} (Age: {patient.age})</p>
                  <p className="text-sm text-gray-600">{patient.email} | {patient.contact_number}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectPatient(patient)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                  >
                    {selectedPatient?.id === patient.id ? 'View Visits' : 'Select Patient'}
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedPatient && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Visits for {selectedPatient.patient_name}</h2>
          <button
            onClick={() => setShowVisitForm(!showVisitForm)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
          >
            {showVisitForm ? 'Hide Visit Form' : 'Add New Visit'}
          </button>

          {showVisitForm && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">New Visit for {selectedPatient.patient_name}</h3>
              <form onSubmit={handleCreateVisit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  Visit Date:
                  <input type="date" name="visitDate" value={newVisitData.visitDate} onChange={handleNewVisitChange} className="p-2 border rounded" required />
                </label>
                <input type="text" name="reasonForVisit" placeholder="Reason for Visit" value={newVisitData.reasonForVisit} onChange={handleNewVisitChange} className="p-2 border rounded" required />
                <input type="text" name="diagnosis" placeholder="Diagnosis" value={newVisitData.diagnosis} onChange={handleNewVisitChange} className="p-2 border rounded" />
                <input type="text" name="namasteCode" placeholder="NAMASTE Code" value={newVisitData.namasteCode} onChange={handleNewVisitChange} className="p-2 border rounded" />
                <input type="text" name="icd11Code" placeholder="ICD-11 Code" value={newVisitData.icd11Code} onChange={handleNewVisitChange} className="p-2 border rounded" />
                <input type="text" name="treatment" placeholder="Treatment" value={newVisitData.treatment} onChange={handleNewVisitChange} className="p-2 border rounded" />
                <input type="text" name="prescription" placeholder="Prescription" value={newVisitData.prescription} onChange={handleNewVisitChange} className="p-2 border rounded" />
                <input type="text" name="notes" placeholder="Notes" value={newVisitData.notes} onChange={handleNewVisitChange} className="p-2 border rounded" />
                <label className="flex items-center gap-2 col-span-full">
                  <input type="checkbox" name="followUpRequired" checked={newVisitData.followUpRequired} onChange={handleNewVisitChange} />
                  Follow Up Required
                </label>
                {newVisitData.followUpRequired && (
                  <label className="flex items-center gap-2 col-span-full">
                    Follow Up Date:
                    <input type="date" name="followUpDate" value={newVisitData.followUpDate} onChange={handleNewVisitChange} className="p-2 border rounded" />
                  </label>
                )}
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded col-span-full">Create Visit</button>
              </form>
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg p-6">
            {patientVisits.length === 0 ? (
              <p>No visits found for {selectedPatient.patient_name}.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {patientVisits.map((visit) => (
                  <li key={visit.id} className="py-4">
                    <p className="text-lg font-semibold">Visit Date: {new Date(visit.visit_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Reason: {visit.reason_for_visit}</p>
                    {visit.diagnosis && <p className="text-sm text-gray-600">Diagnosis: {visit.diagnosis}</p>}
                    {visit.namaste_code && <p className="text-sm text-gray-600">NAMASTE Code: {visit.namaste_code}</p>}
                    {visit.icd11_code && <p className="text-sm text-gray-600">ICD-11 Code: {visit.icd11_code}</p>}
                    {visit.treatment && <p className="text-sm text-gray-600">Treatment: {visit.treatment}</p>}
                    {visit.prescription && <p className="text-sm text-gray-600">Prescription: {visit.prescription}</p>}
                    {visit.notes && <p className="text-sm text-gray-600">Notes: {visit.notes}</p>}
                    {visit.follow_up_required && <p className="text-sm text-gray-600">Follow Up Required: {new Date(visit.follow_up_date).toLocaleDateString()}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientVisitForm;
