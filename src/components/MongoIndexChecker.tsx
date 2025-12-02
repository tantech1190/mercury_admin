import { useState } from 'react';
import { AlertTriangle, Database, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MongoIndexChecker() {
  const [showModal, setShowModal] = useState(false);

  const instructions = [
    {
      step: 1,
      icon: <Database className="w-6 h-6 text-blue-600" />,
      title: 'Open MongoDB Compass',
      description: 'Launch MongoDB Compass and connect to localhost:27017'
    },
    {
      step: 2,
      icon: <Database className="w-6 h-6 text-purple-600" />,
      title: 'Navigate to Audits Collection',
      description: 'Click your database → Click "audits" collection → Click "Indexes" tab'
    },
    {
      step: 3,
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      title: 'Find storeCode Index',
      description: 'Look for an index named "storeCode_1" or similar with "unique: true"'
    },
    {
      step: 4,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      title: 'Delete the Index',
      description: 'Click the trash icon next to the storeCode index to delete it'
    },
    {
      step: 5,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: 'Upload Again',
      description: 'Try uploading your Excel file again - duplicates should now work!'
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 p-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all z-50 animate-pulse"
        title="Fix Duplicate Issues"
      >
        <AlertTriangle className="w-6 h-6" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Fix Duplicate Filtering Issue
                    </h2>
                    <p className="text-sm text-gray-600">
                      MongoDB has a unique index on storeCode - follow these steps to remove it
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Problem Explanation */}
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-900 mb-2">Why This Happens:</h3>
                    <p className="text-sm text-red-700">
                      MongoDB has a <strong>unique index</strong> on the <code className="bg-red-200 px-1 rounded">storeCode</code> field.
                      This prevents duplicate store codes from being saved, even though your model doesn't require it.
                      The index was likely created during development and needs to be manually removed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {instructions.map((instruction) => (
                  <div
                    key={instruction.step}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-400 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold">
                          {instruction.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {instruction.icon}
                          <h3 className="font-bold text-gray-900">{instruction.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{instruction.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alternative: MongoDB Shell Command */}
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">
                  Alternative: Use MongoDB Shell
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  If you prefer using the command line:
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                  <div>mongo</div>
                  <div>use your_database_name</div>
                  <div>db.audits.dropIndex("storeCode_1")</div>
                </div>
              </div>

              {/* Verification */}
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-green-900 mb-2">How to Verify It Worked:</h3>
                    <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                      <li>Upload your Excel file again</li>
                      <li>Check the browser console for "DETAILED AUDIT-BY-AUDIT BREAKDOWN"</li>
                      <li>All 8 audits should show ✅ SAVED</li>
                      <li>Open Database Debugger (purple icon) to see all 8 audits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
