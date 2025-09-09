import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, ArrowLeft, Calendar, Users, Save } from "lucide-react";

interface HealthCampCreationProps {
  onComplete: (campData: any) => void;
  onBack: () => void;
}

export default function HealthCampCreation({ onComplete, onBack }: HealthCampCreationProps) {
  const [campData, setCampData] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    specializations: [] as string[],
    requirements: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: ""
  });
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const specializations = [
    "General Medicine",
    "Internal Medicine",
    "Infectious Diseases",
    "Pulmonology",
    "Cardiology",
    "Endocrinology",
    "Family Medicine",
    "Emergency Medicine",
    "Public Health"
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
  ];

  // Simulate map initialization
  useEffect(() => {
    if (mapRef.current) {
      // Create a simple map placeholder
      const mapDiv = mapRef.current;
      mapDiv.innerHTML = `
        <div class="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
          <div class="text-center">
            <MapPin class="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p class="text-muted-foreground">Click to select location on map</p>
            <p class="text-sm text-muted-foreground mt-1">
              ${selectedLocation ? `Selected: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}` : 'No location selected'}
            </p>
          </div>
        </div>
      `;

      // Add click handler for location selection
      mapDiv.onclick = () => {
        // Simulate location selection (in real app, this would be from map click)
        const mockLocation = {
          lat: 19.0760 + (Math.random() - 0.5) * 0.1, // Mumbai area with random offset
          lng: 72.8777 + (Math.random() - 0.5) * 0.1
        };
        setSelectedLocation(mockLocation);
        toast({
          title: "Location Selected",
          description: `Location set to ${mockLocation.lat.toFixed(4)}, ${mockLocation.lng.toFixed(4)}`,
        });
      };
    }
  }, [selectedLocation, toast]);

  const handleInputChange = (field: string, value: string) => {
    setCampData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setCampData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const validateForm = () => {
    const required = ['name', 'date', 'startTime', 'endTime', 'capacity', 'address', 'city', 'state', 'contactPerson', 'contactPhone'];
    return required.every(field => campData[field as keyof typeof campData].toString().trim() !== '') && selectedLocation !== null;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields and select a location on the map.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create health camp
    const healthCamp = {
      ...campData,
      id: Date.now(),
      location: selectedLocation,
      createdDate: new Date().toISOString(),
      status: 'active',
      booked: 0,
      capacity: parseInt(campData.capacity),
      createdBy: 'admin' // In real app, this would be current admin user
    };

    // Save to localStorage
    const existingCamps = JSON.parse(localStorage.getItem('healthCamps') || '[]');
    localStorage.setItem('healthCamps', JSON.stringify([...existingCamps, healthCamp]));

    setIsSubmitting(false);
    
    toast({
      title: "Health Camp Created",
      description: `${campData.name} has been created successfully and is now active.`,
    });

    onComplete(healthCamp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Create Health Camp
                </CardTitle>
                <CardDescription>
                  Set up a new health camp for migrant workers in your area
                </CardDescription>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Camp Name *</Label>
                  <Input
                    id="name"
                    value={campData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Central Mumbai Health Camp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={campData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={campData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Free health checkup and consultation for migrant workers..."
                  rows={3}
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={campData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={campData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={campData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={campData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street, Near Railway Station"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={campData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={campData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={campData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="400001"
                  />
                </div>
              </div>

              {/* Map Selection */}
              <div className="space-y-2">
                <Label>Select Location on Map *</Label>
                <div ref={mapRef} className="cursor-pointer">
                  {/* Map will be rendered here */}
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Specializations</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {specializations.map((spec) => (
                  <div key={spec} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={spec}
                      checked={campData.specializations.includes(spec)}
                      onChange={() => handleSpecializationToggle(spec)}
                      className="rounded border-muted-foreground"
                    />
                    <Label htmlFor={spec} className="text-sm">{spec}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  value={campData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Bring ID proof, any existing medical reports..."
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={campData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    value={campData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={campData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="contact@healthcamp.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !validateForm()}
                size="lg"
              >
                {isSubmitting ? (
                  "Creating Camp..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Health Camp
                  </>
                )}
              </Button>
            </div>

            {/* Guidelines */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Camp Creation Guidelines:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure adequate medical staff and facilities</li>
                <li>• Coordinate with local authorities for permissions</li>
                <li>• Plan for proper sanitation and safety measures</li>
                <li>• Prepare for registration and documentation</li>
                <li>• Consider language barriers and cultural sensitivity</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}