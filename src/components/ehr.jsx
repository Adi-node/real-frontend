export default function EHR() {
    return (
        <div className="pb-15">

            <div className="text-center p-15">
                <p className="text-[#0a5614] font-bold text-3xl m-5 ">Electronic Health Records</p>
                <p>Comprehensive patient management with integrated traditional and modern medical records</p>
            </div>

            <div className="mx-40 grid grid-cols-4 gap-10">
                <div className="bg-gradient-to-br from-[#fcf8ec] to-white hover:shadow-2xl transition duration-500 px-8 py-6 rounded-xl flex flex-col justify-center items-center gap-5 ">
                    <div className="bg-[#0a5714] h-13 w-13 rounded-full flex justify-center items-center text-white text-xl">
                        <i class="fa-solid fa-user-plus"></i>
                    </div>
                    <p className="font-bold text-xl text-[#0a5614]">New Patient</p>
                    <p className="text-center text-[#a7aab1]">Create comprehensive patient record</p>
                </div>

                <div className="bg-gradient-to-br from-[#f7fafe] to-white hover:shadow-2xl transition duration-500 px-8 py-6 rounded-xl flex flex-col justify-center items-center gap-5 ">
                    <div className="bg-[#0152cd] h-13 w-13 rounded-full flex justify-center items-center text-white text-xl">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <p className="font-bold text-xl text-[#0152cd]">Search Records</p>
                    <p className="text-center text-[#a7aab1]">Find patient information quickly</p>
                </div>

                <div className="bg-gradient-to-br from-[#f8f3db] to-white hover:shadow-2xl transition duration-500 px-8 py-6 rounded-xl flex flex-col justify-center items-center gap-5 ">
                    <div className="bg-[#dab530] h-13 w-13 rounded-full flex justify-center items-center text-white text-xl">
                        <i class="fa-solid fa-chart-line"></i>
                    </div>
                    <p className="font-bold text-xl text-[#dab530]">Analytics</p>
                    <p className="text-center text-[#a7aab1]">Patient care insights</p>
                </div>

                <div className="bg-gradient-to-br from-[#f4f5f6] to-white hover:shadow-2xl transition duration-500 px-8 py-6 rounded-xl flex flex-col justify-center items-center gap-5 ">
                    <div className="bg-[#495463] h-13 w-13 rounded-full flex justify-center items-center text-white text-xl">
                        <i class="fa-solid fa-download"></i>
                    </div>
                    <p className="font-bold text-xl text-[#495463]">Export</p>
                    <p className="text-center text-[#a7aab1]">PDF & JSON formats</p>
                </div>
            </div>

            <div className="mx-40 rounded-3xl shadow-xl mt-15">
                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#0a5614] to-[#0152cb] text-white rounded-t-3xl">
                    <div>
                        <p className="font-bold text-xl"> Patient Record Management</p>
                    </div>

                    <div className="flex gap-5 items-center">
                        <span className="bg-[#ffffff49] rounded-full p-3 cursor-pointer flex justify-center items-center">
                            <i class="fa-solid fa-plus"></i>
                            New Record
                        </span>
                        <span className="bg-[#ffffff49] rounded-full p-3 cursor-pointer flex justify-center items-center">
                            <i class="fa-solid fa-filter"></i>
                            Filter
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5 p-5">
                    {/* Left Panel - Patient Information Form */}
                    <div className="border rounded-2xl bg-[#fcfbf7] border-[#d8ba41] p-6">
                        <p className="font-bold text-xl text-[#0a5614]">Patient Information Form</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="py-2">Patient Name*</p>
                                <input type="text" placeholder="Full name"
                                    className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]"
                                />
                            </div>
                            <div>
                                <p className="py-2">Age*</p>
                                <input type="text" name="" id="" placeholder="Years"
                                    className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]" />
                            </div>
                        </div>

                        <p className="py-3">Contact Number *</p>
                        <input type="text" placeholder="+91 XXXXX XXXXX" className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]" />

                        <div className="flex justify-between items-center py-3">
                            <p>Disease/Diagnosis *</p>
                            <button className="bg-[#0a5614] text-white px-3 py-1 rounded-md text-sm">
                                <i className="fa-solid fa-code"></i> Dual Code
                            </button>
                        </div>
                        <input type="text" placeholder="Enter diagnosis or symptoms" className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]" />

                        <div className="py-3 flex gap-3">
                            <span className="bg-[#d8ba41] text-white px-3 py-1 rounded text-sm">
                                NAMASTE: NAM.DIG.001.234
                            </span>
                            <span className="bg-[#0152cd] text-white px-3 py-1 rounded text-sm">
                                ICD-11: DA90.0
                            </span>
                        </div>

                        <p className="py-3">Treatment Summary</p>
                        <textarea name="" id="" rows={2} className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]" placeholder="Treatment plan and approach"></textarea>

                        <p className="py-3">Diagnostic Reports</p>
                        <div className="flex flex-col justify-center items-center gap-2 border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full text-[#cfd3d9] border-dashed">
                            <i class="fa-solid fa-cloud-arrow-up text-4xl"></i>
                            <p>Drag and drop files or click to upload</p>
                        </div>

                        <p className="py-3">Prescription & Medicines</p>
                        <textarea name="" id="" rows={3} placeholder="Prescribed medications and dosage" className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]"></textarea>

                        <div className="grid grid-cols-2 gap-4 py-3">
                            <span>
                                <p>Hospital/Clinic Name</p>
                                <input type="text" placeholder="Healthcare facility" className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]" />
                            </span>
                            <span>
                                <p>Doctor/Practitioner Name</p>
                                <input type="text" name="" id="" placeholder="Healthcare provider" className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]" />
                            </span>
                        </div>

                        <p className="py-3">Date of Reporting</p>
                        <input type="date" name="" id="" className="border rounded-xl border-[#cfd3d9] px-4 bg-white py-3 w-full focus:outline-none focus:border-[#d8ba41] focus:ring-1 focus:ring-[#d8ba41]" />

                        <div className="grid grid-cols-3 gap-5 mt-5">
                            <button className="col-span-2 flex items-center justify-center gap-2 text-white font-bold rounded-xl py-3 bg-gradient-to-r from-[#0a5614] to-[#d2ae2e] hover:shadow-lg transition-transform hover:-translate-y-1 duration-300">
                                <i className="fa-solid fa-floppy-disk"></i>
                                <span>Save Record</span>
                            </button>
                            <button className="col-span-1 border border-gray-400 text-gray-600 font-bold rounded-xl py-3 bg-white hover:bg-gray-100 hover:border-gray-500 transition duration-300">
                                Cancel
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Patient Records List */}
                    <div className="border rounded-2xl bg-white border-gray-200 p-6">
                        <p className="font-bold text-xl text-[#0152cd] mb-4">Patient Records List</p>
                        
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input 
                                type="text" 
                                placeholder="Search by name, contact, diagnosis..." 
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0152cd] focus:ring-1 focus:ring-[#0152cd]"
                            />
                        </div>

                        {/* Patient Records */}
                        <div className="space-y-4">
                            {/* Patient 1 - Priya Sharma */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                        PS
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Priya Sharma</h3>
                                        <p className="text-sm text-gray-500">+91 98765 43210</p>
                                        <p className="text-sm text-gray-600"><span className="font-medium">Diagnosis:</span> Functional Dyspepsia</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="bg-[#d8ba41] text-white px-2 py-1 rounded text-xs">NAM.DIG.001.234</span>
                                            <span className="bg-[#0152cd] text-white px-2 py-1 rounded text-xs">DA90.0</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Last updated: 2024-01-15</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition">
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Patient 2 - Rajesh Kumar */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                                        RK
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Rajesh Kumar</h3>
                                        <p className="text-sm text-gray-500">+91 87654 32109</p>
                                        <p className="text-sm text-gray-600"><span className="font-medium">Diagnosis:</span> Chronic Back Pain</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="bg-[#d8ba41] text-white px-2 py-1 rounded text-xs">NAM.MSK.002.156</span>
                                            <span className="bg-[#0152cd] text-white px-2 py-1 rounded text-xs">FB50.1</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Last updated: 2024-01-12</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition">
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Patient 3 - Anita Verma */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                        AV
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Anita Verma</h3>
                                        <p className="text-sm text-gray-500">+91 76543 21098</p>
                                        <p className="text-sm text-gray-600"><span className="font-medium">Diagnosis:</span> Hypertension</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="bg-[#d8ba41] text-white px-2 py-1 rounded text-xs">NAM.CVS.003.789</span>
                                            <span className="bg-[#0152cd] text-white px-2 py-1 rounded text-xs">BA00.Z</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Last updated: 2024-01-10</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition">
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">Showing 3 of 24 records</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition">
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <button className="w-8 h-8 bg-[#0a5614] text-white rounded-lg font-medium">1</button>
                                <button className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">2</button>
                                <button className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">3</button>
                                <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg transition">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
