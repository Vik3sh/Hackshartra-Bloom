import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, Download } from 'lucide-react';

interface ActionBarProps {
  onUploadClick: () => void;
  onFindReviewersClick: () => void;
  onExportClick: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onUploadClick,
  onFindReviewersClick,
  onExportClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 bg-white rounded-lg border border-blue-200 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Certificate Management</h2>
        <p className="text-sm text-gray-600 mt-1">Manage and track your academic and professional certificates</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onUploadClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Upload New Certificate
        </Button>

        <Button
          onClick={onFindReviewersClick}
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Find Reviewers
        </Button>

        <Button
          onClick={onExportClick}
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Certificates
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
