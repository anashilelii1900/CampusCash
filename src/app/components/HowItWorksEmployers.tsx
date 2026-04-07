import {
  Users,
  FileText,
  Filter,
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { NavigateOptions, PageType, UserRole } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HowItWorksEmployersProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout?: () => void;
}

export function HowItWorksEmployers({
  onNavigate,
  userRole,
  onLogout,
}: HowItWorksEmployersProps) {
  const steps = [
    {
      number: "01",
      title: "Create Company Profile",
      description:
        "Register your business and create a compelling company profile. Showcase your brand and what makes your organization a great place to work.",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      number: "02",
      title: "Post Your Job",
      description:
        "Create detailed job listings with your requirements, schedule, and compensation. Our smart system matches you with qualified students.",
      icon: Target,
      color: "bg-purple-500",
    },
    {
      number: "03",
      title: "Review Applications",
      description:
        "Browse applications from motivated students. Review profiles, skills, and availability to find the perfect match for your needs.",
      icon: Filter,
      color: "bg-[#C9940A]",
    },
    {
      number: "04",
      title: "Hire & Collaborate",
      description:
        "Connect with selected candidates, manage work schedules, and build a reliable team of student workers for your business.",
      icon: Users,
      color: "bg-green-500",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Quality Talent Pool",
      description:
        "Access thousands of motivated university students across Tunisia",
    },
    {
      icon: Zap,
      title: "Fast Hiring",
      description:
        "Fill positions quickly with our streamlined application process",
    },
    {
      icon: Shield,
      title: "Verified Students",
      description:
        "All students are verified with university credentials",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track applications, manage hiring, and measure performance",
    },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out the platform",
      features: [
        "Post up to 2 jobs per month",
        "Basic applicant filtering",
        "Email support",
        "Standard job visibility",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "99 TND",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Unlimited job postings",
        "Advanced filtering & search",
        "Priority support",
        "Featured job listings",
        "Analytics dashboard",
        "Bulk messaging",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "Custom contracts",
      ],
      highlighted: false,
    },
  ];

  const successStories = [
    {
      company: "TechStart Tunisia",
      industry: "Technology",
      quote:
        "We've hired 15 talented computer science students through CampusCash. The quality of candidates is exceptional and they bring fresh perspectives to our projects.",
      result: "15 hires in 3 months",
    },
    {
      company: "Café Culturel",
      industry: "Hospitality",
      quote:
        "Finding reliable part-time staff was always challenging. CampusCash made it easy to connect with students who fit our flexible schedule perfectly.",
      result: "95% retention rate",
    },
    {
      company: "Marketing Pro",
      industry: "Marketing",
      quote:
        "The students we hired are creative, tech-savvy, and eager to learn. They've become an integral part of our social media and content teams.",
      result: "40% cost savings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar
        onNavigate={onNavigate}
        userRole={userRole}
        onLogout={onLogout}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#111111] via-[#1A1A1A] to-[#111111] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, #C9940A 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#C9940A]/20 px-4 py-2 rounded-full mb-6">
                <span className="text-[#C9940A] font-semibold">
                  For Employers
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Hire{" "}
                <span className="text-[#C9940A]">
                  Talented Students
                </span>{" "}
                Today
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Connect with Tunisia's brightest university
                students. Build a flexible workforce that grows
                with your business needs.
              </p>
              <button
                onClick={() => onNavigate("auth")}
                className="bg-[#C9940A] text-white px-8 py-4 rounded-xl hover:bg-[#A67800] transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                Start Hiring Now
              </button>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518731694-41ea7fa6a2d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGVtcGxveWVyJTIwcmVjcnVpdG1lbnQlMjBvZmZpY2V8ZW58MXx8fHwxNzcxNjc3NDU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Employer recruiting"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#C9940A] text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">500+</div>
                <div className="text-sm">Active Employers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">
              Simple Hiring Process
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect student workers in 4 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-[#FFFFFF] p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <step.icon className="text-white" size={32} />
                </div>
                <div className="absolute top-8 right-8 text-6xl font-bold text-gray-200 group-hover:text-[#C9940A]/20 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">
              Why Employers Choose Us
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to build your student
              workforce
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C9940A]/10 rounded-2xl mb-6 group-hover:bg-[#C9940A] transition-colors">
                  <feature.icon
                    className="text-[#C9940A] group-hover:text-white transition-colors"
                    size={36}
                  />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your hiring needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-[#111111] text-white shadow-2xl scale-105"
                    : "bg-[#FFFFFF] hover:shadow-xl"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#C9940A] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3
                    className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-[#111111]"}`}
                  >
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={
                      plan.highlighted
                        ? "text-gray-300"
                        : "text-gray-600"
                    }
                  >
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle
                        className={`mr-3 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-[#C9940A]" : "text-[#C9940A]"}`}
                        size={20}
                      />
                      <span
                        className={
                          plan.highlighted
                            ? "text-gray-200"
                            : "text-gray-700"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate("auth")}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-[#C9940A] text-white hover:bg-[#A67800]"
                      : "bg-[#111111] text-white hover:bg-[#1A1A1A]"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">
              Employer Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how businesses are thriving with student
              talent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="inline-block bg-[#C9940A] text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    {story.result}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{story.quote}"
                </p>
                <div>
                  <div className="font-bold text-[#111111] text-lg">
                    {story.company}
                  </div>
                  <div className="text-sm text-gray-600">
                    {story.industry}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#111111] to-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Team?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of businesses already hiring talented
            students through CampusCash
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("auth")}
              className="bg-[#C9940A] text-white px-8 py-4 rounded-xl hover:bg-[#A67800] transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              Post Your First Job
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="border border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-[#111111] transition-all text-lg font-semibold"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}