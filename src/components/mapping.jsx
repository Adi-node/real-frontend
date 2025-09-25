
import React, { useState, useEffect, useCallback } from "react";
import apiClient from '../services/authService'; // Assuming apiClient is exported from authService
import { debounce } from 'lodash';

export default function Mapping() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({ namaste: [], icd11: [] });
    const [selectedNamasteCode, setSelectedNamasteCode] = useState(null);
    const [selectedIcd11Code, setSelectedIcd11Code] = useState(null);
    const [mappingResult, setMappingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    const fetchAutocompleteResults = useCallback(debounce(async (query) => {
        if (query.length < 2) {
            setSearchResults({ namaste: [], icd11: [] });
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/codes/autocomplete?query=${query}`);
            setSearchResults(response.data);
        } catch (err) {
            console.error("Error fetching autocomplete results:", err);
            setError("Failed to fetch autocomplete results.");
        } finally {
            setLoading(false);
        }
    }, 300), []);

    useEffect(() => {
        if (searchTerm) {
            fetchAutocompleteResults(searchTerm);
        } else {
            setSearchResults({ namaste: [], icd11: [] });
        }
    }, [searchTerm, fetchAutocompleteResults]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedNamasteCode(null);
        setSelectedIcd11Code(null);
        setMappingResult(null);
    };

    const handleCodeSelection = async (codeType, codeId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/codes/${codeType}/${codeId}`);
            if (codeType === 'namaste') {
                setSelectedNamasteCode(response.data);
            } else {
                setSelectedIcd11Code(response.data);
            }
            setSearchTerm(''); // Clear search term after selection
            setSearchResults({ namaste: [], icd11: [] });
        } catch (err) {
            console.error(`Error fetching ${codeType} code details:`, err);
            setError(`Failed to fetch ${codeType} code details.`);
        } finally {
            setLoading(false);
        }
    };

    const handleMapCodes = async () => {
        if (!selectedNamasteCode || !selectedIcd11Code) {
            setError("Please select both a NAMASTE and an ICD-11 code to find a mapping.");
            return;
        }
        setLoading(true);
        setError(null);
        setMappingResult(null);
        try {
            const response = await apiClient.get(
                `/codes/map?namasteCodeId=${selectedNamasteCode.id}&icd11CodeId=${selectedIcd11Code.id}`
            );
            if (response.data.data && response.data.data.length > 0) {
                setMappingResult(response.data.data[0]);
            } else {
                setMappingResult({ message: "No direct mapping found for the selected codes." });
            }
        } catch (err) {
            console.error("Error fetching code mapping:", err);
            setError("Failed to fetch code mapping.");
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = (type) => {
        if (type === 'namaste') {
            setSelectedNamasteCode(null);
        } else {
            setSelectedIcd11Code(null);
        }
        setMappingResult(null);
    };

    return (
        <div className="pb-15 bg-gradient-to-br from-[#fdfbf5] to-white">
            <div className="text-center p-15">
                <p className="text-[#0a5614] font-bold text-3xl m-5 ">Intelligent Dual Coding Dashboard</p>
                <p>Advanced tools for seamless code mapping and medical diagnosis management</p>
            </div>

            <div className="mx-40 rounded-3xl shadow-xl bg-white ">
                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#0a5614] to-[#0152cb] text-white rounded-t-3xl">
                    <div className="flex gap-5 items-center">
                        <span className="h-11 w-11 rounded-full flex justify-center items-center text-white bg-[#ffffff49]">
                            <i className="fa-solid fa-code text-2xl"></i>
                        </span>
                        <div>
                            <p className="font-bold text-xl"> Code Mapping Interface</p>
                            <p>Real-time NAMASTE ↔ ICD-11 translation</p>
                        </div>
                    </div>
                    <div className="flex gap-5 items-center">
                        <span className="bg-[#ffffff49] rounded-full p-3 cursor-pointer flex justify-center items-center">
                            <i className="fa-solid fa-download"></i>
                            Export
                        </span>
                        <span className="bg-[#ffffff49] rounded-full p-3 cursor-pointer flex justify-center items-center">
                            <i className="fa-solid fa-gear"></i>
                            Settings
                        </span>
                    </div>
                </div>

                <div className="p-5 gap-10 grid grid-cols-3">
                    <div className="col-span-2">
                        <div className="bg-[#fdfbf5] rounded-3xl p-6 border border-[#e7d58e]  ">
                            <p className="font-bold text-2xl text-[#0a5614]">Code Search & Mapping</p>
                            <div className={`relative flex my-4 justify-between items-center gap-3 bg-white rounded-lg px-4 py-1 border ${isFocused ? 'border-[#f5bd04] border-2' : 'border-[#e7d58e]'}`}>
                                <i className="fa-solid fa-magnifying-glass text-[#e7d58e] "></i>
                                <input
                                    type="text"
                                    placeholder="Enter disease name, NAMASTE code or ICD-11 code..."
                                    className="focus:outline-none w-full"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow click on results
                                />
                                <span
                                    onClick={handleMapCodes}
                                    className="px-3 py-1 rounded-lg bg-[#0a5614] text-white cursor-pointer"
                                >
                                    Search
                                </span>
                                {isFocused && searchTerm && (searchResults.namaste.length > 0 || searchResults.icd11.length > 0) && (
                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                        {searchResults.namaste.length > 0 && (
                                            <div className="border-b border-gray-200 p-2 font-semibold text-gray-700">NAMASTE Codes</div>
                                        )}
                                        {searchResults.namaste.map((code) => (
                                            <div
                                                key={code.id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                onClick={() => handleCodeSelection('namaste', code.id)}
                                            >
                                                <span className="font-bold">{code.code}</span> - {code.display_name} ({code.sanskrit_name})
                                            </div>
                                        ))}
                                        {searchResults.icd11.length > 0 && (
                                            <div className="border-b border-gray-200 p-2 font-semibold text-gray-700">ICD-11 Codes</div>
                                        )}
                                        {searchResults.icd11.map((code) => (
                                            <div
                                                key={code.id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                onClick={() => handleCodeSelection('icd11', code.id)}
                                            >
                                                <span className="font-bold">{code.code}</span> - {code.display_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {loading && <div className="text-center text-gray-500">Loading...</div>}
                            {error && <div className="text-center text-red-600">Error: {error}</div>}

                            <div className="grid grid-cols-2 gap-5">
                                <span className="p-3 rounded-lg border bg-[#e4eadf] border-[#0a5615] text-[#0a5615] cursor-pointer text-center">
                                    <i className="fa-solid fa-leaf"></i>
                                    NAMASTE Codes
                                </span>
                                <span className="p-3 rounded-lg border bg-[#e4ebf7] border-[#0057b6] text-[#0057b6] cursor-pointer text-center">
                                    <i className="fa-solid fa-hospital"></i>
                                    ICD-11 Codes
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#e7eefb] border border-[#0057b6] rounded-3xl p-5">
                        <p className="text-[#0057b6] font-bold text-2xl">Quick Actions</p>
                        <div className="*:my-5">
                            <p className="p-3 rounded-lg border border-[#0057b6]">
                                <i className="fa-solid fa-clock-rotate-left text-[#dab431]"></i>
                                Recent Searches
                            </p>
                            <p className="p-3 rounded-lg border border-[#0057b6]">
                                <i className="fa-solid fa-bookmark text-[#0057b6]"></i>
                                Saved Mappings
                            </p>
                            <p className="p-3 rounded-lg border border-[#0057b6]">
                                <i className="fa-solid fa-chart-bar text-[#0a5615]"></i>
                                Analytics
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 py-5 px-10">
                    <div className="bg-[#fdfbf5] rounded-2xl p-5 border-l-4 border-[#0a5615]">
                        <div className="flex justify-between items-center mb-5">
                            <p className="font-bold text-2xl text-[#0a5614]">NAMASTE Code</p>
                            {selectedNamasteCode && (
                                <button onClick={() => clearSelection('namaste')} className="text-sm text-red-500 hover:text-red-700">Clear</button>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl p-4 ">
                            {selectedNamasteCode ? (
                                <>
                                    <p className="font-bold text-2xl text-[#0a5614]">{selectedNamasteCode.code}</p>
                                    <p className="font-semibold text-lg">{selectedNamasteCode.sanskrit_name} ({selectedNamasteCode.display_name})</p>
                                    <p className="text-sm text-[#263040] my-3">{selectedNamasteCode.description}</p>
                                    <div className="text-[#0a5614] *:p-2 *:bg-[#f6e7bb] *:rounded-full text-xs *:mr-3 my-4">
                                        <span>{selectedNamasteCode.category}</span>
                                        <span>{selectedNamasteCode.subcategory}</span>
                                        <span>{selectedNamasteCode.system_type}</span>
                                    </div>
                                    {selectedNamasteCode.synonyms && selectedNamasteCode.synonyms.length > 0 && (
                                        <p className="font-bold text-xs text-[#263040]">
                                            Synonyms: <span className="text-xs text-[#263040]">{selectedNamasteCode.synonyms.join(', ')}</span>
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500">Select a NAMASTE code to view details.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#f9fcfe] rounded-2xl p-5 border-l-4 border-[#0052cb]">
                        <div className="flex justify-between items-center mb-5">
                            <p className="font-bold text-2xl text-[#0052cb]">ICD-11 Code</p>
                            {selectedIcd11Code && (
                                <button onClick={() => clearSelection('icd11')} className="text-sm text-red-500 hover:text-red-700">Clear</button>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl p-4 ">
                            {selectedIcd11Code ? (
                                <>
                                    <p className="font-bold text-2xl text-[#0052cb]">{selectedIcd11Code.code}</p>
                                    <p className="font-semibold text-lg">{selectedIcd11Code.display_name}</p>
                                    <p className="text-sm text-[#263040] my-3">{selectedIcd11Code.description}</p>
                                    <div className="text-[#0052cb] *:p-2 *:bg-[#e2f3ff] *:rounded-full text-xs *:mr-3 my-4">
                                        <span>{selectedIcd11Code.category}</span>
                                    </div>
                                    {selectedIcd11Code.parent_code && (
                                        <p className="font-bold text-xs text-[#263040]">
                                            Parent: <span className="text-xs text-[#263040]">{selectedIcd11Code.parent_code}</span>
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500">Select an ICD-11 code to view details.</p>
                            )}
                        </div>
                    </div>
                </div>

                {mappingResult && (
                    <div className="p-10">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Mapping Result</h3>
                        {mappingResult.message ? (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                                <p className="font-bold">No Direct Mapping</p>
                                <p>{mappingResult.message}</p>
                            </div>
                        ) : (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
                                <p className="font-bold">Mapping Found!</p>
                                <p><strong>Type:</strong> {mappingResult.mappingType}</p>
                                <p><strong>Confidence Score:</strong> {mappingResult.confidenceScore}</p>
                                {mappingResult.notes && <p><strong>Notes:</strong> {mappingResult.notes}</p>}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}