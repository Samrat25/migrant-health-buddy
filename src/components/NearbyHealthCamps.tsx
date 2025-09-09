import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  ArrowLeft, 
  Calendar, 
  Users, 
  Search,
  Navigation,
  Clock,
  Phone,
  BookOpen
} from "lucide-react";

interface NearbyHealthCampsProps {
  onBack: () => void;
}

export default function NearbyHealthCamps({ onBack }: NearbyHealthCampsProps) {
  const [searchLocation, setSearchLocation] = useState("");
  const [healthCamps, setHealthCamps] = useState<any[]>([]);
  const [bookedCamps, setBookedCamps] = useState<number[]>([]);
  const { toast } = useToast();

  // Mock health camps data (in real app, this would come from localStorage or API)
  const mockHealthCamps = [
    {
      id: 1,
      name: "Central Mumbai Health Camp",
      description: "Free health checkup and consultation for migrant workers",
      date: "2024-01-25",
      startTime: "09:00",
      endTime: "17:00",
      address: "Plot No. 123, Near Central Railway Station, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      capacity: 100,
      booked: 45,
      specializations: ["General Medicine", "Internal Medicine", "Infectious Diseases"],
      contactPerson: "Dr. Amit Sharma",
      contactPhone: "+91 9876543210",
      distance: "2.3 km",
      status: "active"
    },
    {
      id: 2,
      name: "North Zone Health Camp",
      description: "Comprehensive health screening and preventive care",
      date: "2024-01-28",
      startTime: "08:00",
      endTime: "16:00",
      address: "Community Center, Sector 15, Navi Mumbai",
      city: "Navi Mumbai",
      state: "Maharashtra",
      capacity: 75,
      booked: 32,
      specializations: ["Family Medicine", "Pulmonology", "Cardiology"],
      contactPerson: "Dr. Priya Patel",
      contactPhone: "+91 9123456789",
      distance: "5.7 km",
      status: "active"
    },
    {
      id: 3,
      name: "East Side Mobile Clinic",
      description: "Mobile health camp for construction workers",
      date: "2024-01-30",
      startTime: "10:00",
      endTime: "18:00",
      address: "Near Construction Site, Powai, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      capacity: 50,
      booked: 28,
      specializations: ["Emergency Medicine", "General Medicine"],
      contactPerson: "Dr. Rajesh Kumar",
      contactPhone: "+91 9988776655",
      distance: "8.1 km",
      status: "active"
    },
    {
      id: 4,
      name: "Thane District Health Camp",
      description: "Multi-specialty health camp with lab facilities",
      date: "2024-02-02",
      startTime: "09:30",
      endTime: "17:30",
      address: "Municipal Ground, Thane West",
      city: "Thane",
      state: "Maharashtra",
      capacity: 120,
      booked: 67,
      specializations: ["General Medicine", "Endocrinology", "Public Health"],
      contactPerson: "Dr. Sunita Joshi",
      contactPhone: "+91 9876543210",
      distance: "12.5 km",
      status: "active"
    }
  ];

  useEffect(() => {
    // Load health camps from localStorage or use mock data
    const savedCamps = localStorage.getItem('healthCamps');
    if (savedCamps) {
      const camps = JSON.parse(savedCamps);
      setHealthCamps([...camps, ...mockHealthCamps]);
    } else {
      setHealthCamps(mockHealthCamps);
    }

    // Load booked camps
    const savedBookings = localStorage.getItem('bookedHealthCamps');
    if (savedBookings) {
      setBookedCamps(JSON.parse(savedBookings));
    }
  }, []);

  const bookHealthCamp = (campId: number) => {
    if (bookedCamps.includes(campId)) {
      toast({
        title: "Already Booked",
        description: "You have already booked this health camp.",
        variant: "destructive",
      });
      return;
    }

    const newBookedCamps = [...bookedCamps, campId];
    setBookedCamps(newBookedCamps);
    localStorage.setItem('bookedHealthCamps', JSON.stringify(newBookedCamps));

    // Update camp booking count
    const updatedCamps = healthCamps.map(camp => 
      camp.id === campId 
        ? { ...camp, booked: camp.booked + 1 }
        : camp
    );
    setHealthCamps(updatedCamps);

    const camp = healthCamps.find(c => c.id === campId);
    toast({
      title: "Booking Confirmed",
      description: `Successfully booked ${camp?.name}. You'll receive confirmation details shortly.`,
    });
  };

  const cancelBooking = (campId: number) => {
    const newBookedCamps = bookedCamps.filter(id => id !== campId);
    setBookedCamps(newBookedCamps);
    localStorage.setItem('bookedHealthCamps', JSON.stringify(newBookedCamps));

    // Update camp booking count
    const updatedCamps = healthCamps.map(camp => 
      camp.id === campId 
        ? { ...camp, booked: Math.max(0, camp.booked - 1) }
        : camp
    );
    setHealthCamps(updatedCamps);

    const camp = healthCamps.find(c => c.id === campId);
    toast({
      title: "Booking Cancelled",
      description: `Cancelled booking for ${camp?.name}.`,
    });
  };

  const getAvailabilityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const filteredCamps = healthCamps.filter(camp => 
    searchLocation === '' || 
    camp.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
    camp.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
    camp.state.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Nearby Health Camps
                </CardTitle>
                <CardDescription>
                  Find and book health camps in your area
                </CardDescription>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city, area, or address..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Bookings Summary */}
        {bookedCamps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                My Bookings ({bookedCamps.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {bookedCamps.map(campId => {
                  const camp = healthCamps.find(c => c.id === campId);
                  return camp ? (
                    <Badge key={campId} variant="outline" className="bg-primary/10">
                      {camp.name} - {new Date(camp.date).toLocaleDateString()}
                    </Badge>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Camps List */}
        <div className="space-y-4">
          {filteredCamps.map((camp) => (
            <Card key={camp.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      {camp.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {camp.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-success/10">
                      {camp.distance}
                    </Badge>
                    {bookedCamps.includes(camp.id) && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        Booked
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {new Date(camp.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {camp.startTime} - {camp.endTime}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p>{camp.address}</p>
                    <p className="text-muted-foreground">{camp.city}, {camp.state}</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <span className={getAvailabilityColor(camp.booked, camp.capacity)}>
                        {camp.booked}
                      </span>
                      /{camp.capacity} slots filled
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-1" />
                    {camp.contactPerson}
                  </div>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2">
                  {camp.specializations.map((spec: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  {bookedCamps.includes(camp.id) ? (
                    <>
                      <Button variant="outline" size="sm" disabled>
                        Already Booked
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => cancelBooking(camp.id)}
                      >
                        Cancel Booking
                      </Button>
                    </>
                  ) : camp.booked >= camp.capacity ? (
                    <Button variant="outline" size="sm" disabled>
                      Fully Booked
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => bookHealthCamp(camp.id)}
                    >
                      Book Now
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4 mr-1" />
                    Get Directions
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCamps.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Health Camps Found</h3>
              <p className="text-muted-foreground">
                {searchLocation 
                  ? "No health camps found in the specified location. Try searching for a different area."
                  : "No health camps are currently available. Please check back later."
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">What to Bring:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Valid photo ID (Aadhaar preferred)</li>
                  <li>• Previous medical reports (if any)</li>
                  <li>• List of current medications</li>
                  <li>• Insurance/ESIC card (if applicable)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Services Available:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• General health checkup</li>
                  <li>• Blood pressure and sugar testing</li>
                  <li>• Basic diagnostic tests</li>
                  <li>• Consultation with specialists</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}