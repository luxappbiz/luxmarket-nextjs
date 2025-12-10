'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {  Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import accountService from '@/lib/account-api';

interface GalleryImage {
  file: File;
  preview: string;
  id: string;
}

export default function CreateProduct() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedImageToRemove, setSelectedImageToRemove] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    mileage: '',
    horsepower: '',
    interiorColor: '',
    exteriorColor: '',
    year: '',
    make: '',
    model: '',
    transmissionType: ''
  });
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const categories = [
    { label: 'Real Estate', value: '33' },
    { label: 'Vehicles', value: '32' },
    { label: 'Watches', value: '21' },
  ];
  const transmissionOptions = [
    'Automatic',
    'Manual',
    'CVT',
    'Dual-Clutch',
    'Tiptronic'
  ];
  const yearOptions = Array.from({ length: 50 }, (_, i) => 
    `${new Date().getFullYear() - i}`
  );
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImage: GalleryImage = {
        file,
        preview: URL.createObjectURL(file),
        id: Date.now().toString()
      };
      setGalleryImages(prev => [...prev, newImage]);
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };
  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview('');
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };
  const removeGalleryImage = (imageId: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    setSelectedImageToRemove(null);
  };

  const handleSubmit = async () => {
    if (!thumbnail || !formData.name || !formData.price) {
      toast.error('Missing required fields', {
        description: 'Please provide product name, price and image.'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const productData = {
        title: formData.name,
        regular_price: formData.price,
        category_id: formData.category,
        mileage: formData.mileage,
        horsepower: formData.horsepower,
        interiorColor: formData.interiorColor,
        exteriorColor: formData.exteriorColor,
        year: formData.year,
        make: formData.make,
        model: formData.model,
        transmissionType: formData.transmissionType
      };
      const galleryFiles = galleryImages.map(img => img.file);
      const result = await accountService.createProduct(
        productData,
        thumbnail,
        galleryFiles
      );
      if (result.success) {
        // Reset form
        setFormData({
          name: '', price: '', category: '', mileage: '', horsepower: '',
          interiorColor: '', exteriorColor: '', year: '', make: '', model: '', transmissionType: ''
        });
        setThumbnail(null);
        setThumbnailPreview('');
        setGalleryImages([]);
        toast.success('Success!', {
          description: result.message
        });
      } else {
        toast.error('Failed to create product', {
          description: result.message
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Something went wrong', {
        description: 'Failed to create product. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create New Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <Label className="text-base font-medium mb-3 block">Product Image *</Label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="hidden"
            />
            {thumbnailPreview ? (
              <div className="relative">
                <img 
                  src={thumbnailPreview} 
                  alt="Product thumbnail" 
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full h-64 border-dashed"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <span>Click to select image</span>
                </div>
              </Button>
            )}
          </div>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Price (USD)*</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Enter price"
              />
            </div>
          </div>
          {/* Category */}
          <div className="flex flex-col gap-2">
            <Label>Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Vehicle-specific fields */}
          {formData.category === '32' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="e.g., BMW, Mercedes"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., X5, S-Class"
                  />
                </div>
                <div>
                  <Label>Transmission Type</Label>
                  <Select value={formData.transmissionType} onValueChange={(value) => handleInputChange('transmissionType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionOptions.map((trans) => (
                        <SelectItem key={trans} value={trans}>
                          {trans}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    placeholder="Enter mileage"
                  />
                </div>
                <div>
                  <Label htmlFor="horsepower">Horsepower (HP)</Label>
                  <Input
                    id="horsepower"
                    type="number"
                    value={formData.horsepower}
                    onChange={(e) => handleInputChange('horsepower', e.target.value)}
                    placeholder="Enter horsepower"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interiorColor">Interior Color</Label>
                  <Input
                    id="interiorColor"
                    value={formData.interiorColor}
                    onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                    placeholder="e.g., Black, Beige"
                  />
                </div>
                <div>
                  <Label htmlFor="exteriorColor">Exterior Color</Label>
                  <Input
                    id="exteriorColor"
                    value={formData.exteriorColor}
                    onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                    placeholder="e.g., White, Silver"
                  />
                </div>
              </div>
            </>
          )}
          {/* Gallery Images */}
          <div>
            <Label className="text-base font-medium mb-3 block">Gallery Images</Label>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleGallerySelect}
              className="hidden"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="relative">
                  <Dialog>
                    <DialogTrigger asChild>
                      <img 
                        src={image.preview} 
                        alt="Gallery" 
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-75 transition-opacity"
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Gallery Image</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img src={image.preview} alt="Gallery" className="w-full rounded-lg" />
                        <Button 
                          variant="destructive" 
                          onClick={() => removeGalleryImage(image.id)}
                          className="w-full"
                        >
                          Remove Image
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => galleryInputRef.current?.click()}
                className="h-32 border-dashed"
              >
                <div className="text-center">
                  <Plus className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">Add Image</span>
                </div>
              </Button>
            </div>
          </div>
          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit For Review'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}