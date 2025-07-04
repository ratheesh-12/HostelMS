
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  LocateIcon,
  CalendarCheckIcon,
  ShieldCheckIcon,
  WifiIcon,
  HomeIcon,
  BookOpenIcon,
  CoffeeIcon,
  HeartPulseIcon,
  ChevronRight,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GithubIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const features = [
  {
    icon: <LocateIcon className="h-10 w-10 text-hostel-accent" />,
    title: "Prime Location",
    description: "Located near campus with easy access to all academic buildings and amenities."
  },
  {
    icon: <ShieldCheckIcon className="h-10 w-10 text-hostel-accent" />,
    title: "Secure Environment",
    description: "24/7 security with CCTV monitoring and secure access control systems."
  },
  {
    icon: <WifiIcon className="h-10 w-10 text-hostel-accent" />,
    title: "High-Speed WiFi",
    description: "Reliable, high-speed internet connection throughout the premises."
  },
  {
    icon: <HomeIcon className="h-10 w-10 text-hostel-accent" />,
    title: "Modern Rooms",
    description: "Comfortable, well-furnished rooms with all the essential amenities."
  },
  {
    icon: <BookOpenIcon className="h-10 w-10 text-hostel-accent" />,
    title: "Study Areas",
    description: "Dedicated study zones for individual and group work sessions."
  },
  {
    icon: <CoffeeIcon className="h-10 w-10 text-hostel-accent" />,
    title: "Cafeteria",
    description: "On-site dining with nutritious meal options and snacks."
  },
  {
    icon: <CalendarCheckIcon className="h-10 w-10 text-hostel-accent" />,
    title: "Event Spaces",
    description: "Communal spaces for social gatherings and student events."
  },
  {
    icon: <HeartPulseIcon className="h-10 w-10 text-hostel-accent" />,
    title: "Health Services",
    description: "First-aid facilities with quick access to medical assistance."
  }
];

const faqs = [
  {
    question: "What is the process for booking a room?",
    answer: "To book a room, log in to your student account, navigate to the booking section, and select your preferred room. Your request will be reviewed by hostel staff, and you'll receive a confirmation email once approved."
  },
  {
    question: "What items are provided in the rooms?",
    answer: "Each room comes with a bed, mattress, desk, chair, wardrobe, and bedside table. You'll need to bring your own bedding, towels, and personal items."
  },
  {
    question: "Are there any curfew rules?",
    answer: "The main entrance closes at 11:00 PM, but residents can enter using their access cards. Quiet hours are from 10:00 PM to 6:00 AM to respect all residents."
  },
  {
    question: "Can I have guests over?",
    answer: "Yes, day visitors are allowed from 8:00 AM to 8:00 PM. They must sign in at the reception desk. Overnight guests require prior approval and are subject to additional fees."
  },
  {
    question: "Is there parking available for residents?",
    answer: "Yes, limited parking spaces are available for residents at an additional monthly fee. You'll need to register your vehicle with the hostel administration."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl">HostelMS</Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium hover:text-hostel-primary transition-colors">Features</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-hostel-primary transition-colors">Testimonials</a>
              <a href="#faq" className="text-sm font-medium hover:text-hostel-primary transition-colors">FAQ</a>
              <a href="#contact" className="text-sm font-medium hover:text-hostel-primary transition-colors">Contact</a>
            </nav>
            <ThemeToggle />
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-hostel-primary/10 via-background to-hostel-accent/5 py-20 md:py-32">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 space-y-6 mb-12 md:mb-0 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Modern Student Living for the <span className="text-hostel-primary">Academic Elite</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience comfort, convenience, and community in our premium student hostel. 
              Where academic success meets exceptional living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Book Your Room
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative animate-float">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Student Hostel" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-4 w-24 h-24 rounded-full bg-hostel-primary/10 -z-10"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-hostel-accent/10 -z-10"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Designed for Modern Student Life</h2>
            <p className="text-muted-foreground">
              Our hostels are equipped with everything you need for a comfortable and productive academic experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-hostel-primary/5 to-hostel-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Residents Say</h2>
            <p className="text-muted-foreground">
              Hear from students who have experienced our hostel facilities and services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Computer Science Student",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                quote: "Living here has transformed my university experience. The study areas are perfect for group projects, and I've made lifelong friends."
              },
              {
                name: "Michael Chen",
                role: "Business Administration",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
                quote: "The location is unbeatable - five minutes from my classes and surrounded by cafes and shops. The high-speed internet is a game-changer for online research."
              },
              {
                name: "Priya Patel",
                role: "Medical Student",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
                quote: "As a medical student with late hours, I appreciate the 24/7 security and quiet study environments. The staff are always helpful and responsive."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-background border-none shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <blockquote className="italic mb-4">"{testimonial.quote}"</blockquote>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to the most common questions about our hostel services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions or need more information? Reach out to our team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Message subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message" rows={5} />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 mr-3 text-hostel-primary" />
                    <div>
                      <p>123 University Avenue</p>
                      <p>Campus District, Academic City</p>
                      <p>Postal Code: 54321</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-3 text-hostel-primary" />
                    <p>+1 (555) 123-4567</p>
                  </div>
                  <div className="flex items-center">
                    <MailIcon className="h-5 w-5 mr-3 text-hostel-primary" />
                    <p>info@hostelms.edu</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-hostel-primary transition-colors">
                    <TwitterIcon className="h-6 w-6" />
                  </a>
                  <a href="#" className="hover:text-hostel-primary transition-colors">
                    <InstagramIcon className="h-6 w-6" />
                  </a>
                  <a href="#" className="hover:text-hostel-primary transition-colors">
                    <LinkedinIcon className="h-6 w-6" />
                  </a>
                  <a href="#" className="hover:text-hostel-primary transition-colors">
                    <GithubIcon className="h-6 w-6" />
                  </a>
                </div>
              </div>
              
              <div className="h-72 bg-muted rounded-lg overflow-hidden">
                {/* Embed a Google Map here in a real implementation */}
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <MapPinIcon className="h-12 w-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Google Map Embed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">HostelMS</h3>
              <p className="text-muted-foreground">
                Providing comfortable and secure accommodation for students since 2010.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">About Us</a></li>
                <li><a href="#features" className="text-muted-foreground hover:text-hostel-primary transition-colors">Our Facilities</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-hostel-primary transition-colors">FAQs</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Hostels</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">Sunrise Hostel</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">Maple Residence</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">Horizon Heights</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">Virtual Tour</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">Room Types</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for updates on available rooms and events.
              </p>
              <div className="flex space-x-2">
                <Input placeholder="Your email" className="max-w-[180px]" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2023 HostelMS. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-hostel-primary transition-colors">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
