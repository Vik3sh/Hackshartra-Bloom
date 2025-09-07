import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadCertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (certificateData: any) => void;
}

const UploadCertificateForm: React.FC<UploadCertificateFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    issuingCompany: '',
    customReviewer: '',
    file: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Main categories
  const mainCategories = [
    'Academic',
    'Co-Curricular',
    'Verified Professional Certificates'
  ];

  // Subcategories based on main category
  const getSubcategories = (category: string) => {
    switch (category) {
      case 'Academic':
        return ['Professional', 'National', 'State', 'International', 'Co-Curricular', 'Volunteer / Social Work', 'Workshops / Training', 'Others'];
      case 'Co-Curricular':
        return ['National', 'State', 'International', 'Volunteer / Social Work', 'Workshops / Training', 'Others'];
      case 'Verified Professional Certificates':
        return []; // No subcategories for this
      default:
        return [];
    }
  };

  // Issuing companies for Verified Professional Certificates
  const issuingCompanies = [
    'Google', 'Microsoft', 'LinkedIn', 'AWS', 'Coursera', 'Udemy'
  ];

  // Reviewer assignment logic
  const getReviewers = (subcategory: string) => {
    switch (subcategory) {
      case 'Professional':
        return ['Dr. Ramesh Sharma', 'Prof. Anjali Mehta', 'Dr. Suresh Iyer'];
      case 'National':
        return ['Dr. A.K. Singh', 'Prof. Neha Kapoor'];
      case 'State':
        return ['Dr. Vijay Deshmukh', 'Prof. Meera Rathi'];
      case 'International':
        return ['Dr. Sanjay Malhotra', 'Prof. Priya Bansal'];
      case 'Co-Curricular':
        return ['Nikhil Joshi', 'Pooja Menon'];
      case 'Volunteer / Social Work':
        return ['Amit Tiwari', 'Ritu Sinha'];
      case 'Workshops / Training':
        return ['Deepak Kumar', 'Shalini Pandey'];
      case 'Others':
        return []; // Custom input
      default:
        return [];
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: '',
      issuingCompany: '',
      customReviewer: '',
    }));
    setErrors(prev => ({ ...prev, category: '' }));
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      subcategory,
      customReviewer: '',
    }));
    setErrors(prev => ({ ...prev, subcategory: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, file: 'Please upload a PDF or image file (JPEG, PNG)' }));
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Certificate title is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (formData.category !== 'Verified Professional Certificates' && !formData.subcategory) {
      newErrors.subcategory = 'Please select a subcategory';
    }
    if (formData.category === 'Verified Professional Certificates' && !formData.issuingCompany) {
      newErrors.issuingCompany = 'Please select an issuing company';
    }
    if (formData.subcategory === 'Others' && !formData.customReviewer.trim()) {
      newErrors.customReviewer = 'Please enter a reviewer name';
    }
    if (!formData.file) newErrors.file = 'Please upload a certificate file';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive',
      });
      return;
    }

    // Determine reviewer
    let reviewer = '';
    if (formData.subcategory === 'Others') {
      reviewer = formData.customReviewer;
    } else {
      const reviewers = getReviewers(formData.subcategory);
      reviewer = reviewers.length > 0 ? reviewers[0] : 'Pending Assignment';
    }

    const certificateData = {
      ...formData,
      reviewer,
      status: 'Pending' as const,
      uploadedAt: new Date().toISOString(),
    };

    onSubmit(certificateData);

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      subcategory: '',
      issuingCompany: '',
      customReviewer: '',
      file: null,
    });
    setErrors({});

    toast({
      title: 'Success',
      description: 'Certificate uploaded successfully!',
    });

    onClose();
  };

  const currentSubcategories = getSubcategories(formData.category);
  const currentReviewers = formData.subcategory ? getReviewers(formData.subcategory) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-900">Upload New Certificate</DialogTitle>
          <DialogDescription>
            Fill in the details below to upload your certificate for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certificate Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Certificate Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter certificate title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the certificate (optional)"
              rows={3}
            />
          </div>

          {/* Main Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {mainCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Subcategory or Issuing Company */}
          {formData.category === 'Verified Professional Certificates' ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Issuing Company *
              </Label>
              <Select value={formData.issuingCompany} onValueChange={(value) => setFormData(prev => ({ ...prev, issuingCompany: value }))}>
                <SelectTrigger className={errors.issuingCompany ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select issuing company" />
                </SelectTrigger>
                <SelectContent>
                  {issuingCompanies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.issuingCompany && <p className="text-sm text-red-600">{errors.issuingCompany}</p>}
            </div>
          ) : (
            formData.category && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Subcategory *
                </Label>
                <Select value={formData.subcategory} onValueChange={handleSubcategoryChange}>
                  <SelectTrigger className={errors.subcategory ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subcategory && <p className="text-sm text-red-600">{errors.subcategory}</p>}
              </div>
            )
          )}

          {/* Custom Reviewer for "Others" */}
          {formData.subcategory === 'Others' && (
            <div className="space-y-2">
              <Label htmlFor="customReviewer" className="text-sm font-medium text-gray-700">
                Reviewer Name *
              </Label>
              <Input
                id="customReviewer"
                value={formData.customReviewer}
                onChange={(e) => setFormData(prev => ({ ...prev, customReviewer: e.target.value }))}
                placeholder="Enter reviewer name"
                className={errors.customReviewer ? 'border-red-500' : ''}
              />
              {errors.customReviewer && <p className="text-sm text-red-600">{errors.customReviewer}</p>}
            </div>
          )}

          {/* Assigned Reviewer Display */}
          {formData.subcategory && formData.subcategory !== 'Others' && currentReviewers.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Label className="text-sm font-medium text-blue-900">
                Assigned Reviewer
              </Label>
              <p className="text-sm text-blue-700 mt-1">
                {currentReviewers[0]}
              </p>
            </div>
          )}

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Upload Certificate *
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="certificate-file"
              />
              <label htmlFor="certificate-file" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF or image files (max 5MB)
                </p>
              </label>
              {formData.file && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-sm text-green-600">{formData.file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {errors.file && <p className="text-sm text-red-600">{errors.file}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Upload Certificate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCertificateForm;
