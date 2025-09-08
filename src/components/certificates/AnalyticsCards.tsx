import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, Award } from 'lucide-react';

interface AnalyticsCardsProps {
  totalCertificates: number;
  verifiedCertificates: number;
  pendingCertificates: number;
  approvedCertificates: number;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  totalCertificates,
  verifiedCertificates,
  pendingCertificates,
  approvedCertificates,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Total Certificates</CardTitle>
          <FileText className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{totalCertificates}</div>
          <p className="text-xs text-blue-700 mt-1">
            All uploaded certificates
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Verified Certificates</CardTitle>
          <CheckCircle className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{verifiedCertificates}</div>
          <p className="text-xs text-blue-700 mt-1">
            Fully verified by reviewers
          </p>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-900">Pending Certificates</CardTitle>
          <Clock className="h-5 w-5 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-900">{pendingCertificates}</div>
          <p className="text-xs text-orange-700 mt-1">
            Awaiting review
          </p>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">Approved Certificates</CardTitle>
          <Award className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{approvedCertificates}</div>
          <p className="text-xs text-green-700 mt-1">
            Approved by reviewers
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCards;
